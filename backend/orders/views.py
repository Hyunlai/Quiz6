import base64
import json
from decimal import Decimal, InvalidOperation
from urllib import error, parse, request

from django.conf import settings
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status

from .models import Order
from .serializers import OrderSerializer


def get_paypal_access_token():
	if not settings.PAYPAL_CLIENT_ID or not settings.PAYPAL_CLIENT_SECRET:
		return None, 'PayPal credentials are not configured on the server.'

	credentials = f'{settings.PAYPAL_CLIENT_ID}:{settings.PAYPAL_CLIENT_SECRET}'
	encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
	body = parse.urlencode({'grant_type': 'client_credentials'}).encode('utf-8')

	req = request.Request(
		f"{settings.PAYPAL_BASE_URL}/v1/oauth2/token",
		data=body,
		headers={
			'Authorization': f'Basic {encoded_credentials}',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method='POST',
	)

	try:
		with request.urlopen(req, timeout=10) as response:
			data = json.loads(response.read().decode('utf-8'))
			return data.get('access_token'), None
	except error.HTTPError:
		return None, 'Unable to authenticate with PayPal.'
	except Exception:
		return None, 'PayPal service is currently unavailable.'


def verify_paypal_order(order_id, expected_amount):
	access_token, token_error = get_paypal_access_token()
	if token_error:
		return False, token_error

	req = request.Request(
		f"{settings.PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}",
		headers={
			'Authorization': f'Bearer {access_token}',
			'Content-Type': 'application/json',
		},
		method='GET',
	)

	try:
		with request.urlopen(req, timeout=10) as response:
			data = json.loads(response.read().decode('utf-8'))
	except error.HTTPError:
		return False, 'PayPal order could not be verified.'
	except Exception:
		return False, 'PayPal verification is unavailable right now.'

	if data.get('status') != 'COMPLETED':
		return False, 'PayPal order is not completed.'

	purchase_units = data.get('purchase_units') or []
	if not purchase_units:
		return False, 'PayPal order is missing purchase units.'

	recorded_value = ((purchase_units[0].get('amount') or {}).get('value') or '').strip()
	try:
		captured_amount = Decimal(recorded_value).quantize(Decimal('0.01'))
		expected = Decimal(str(expected_amount)).quantize(Decimal('0.01'))
	except (InvalidOperation, TypeError):
		return False, 'Invalid payment amount.'

	if captured_amount != expected:
		return False, 'PayPal amount does not match requested amount.'

	return True, None


class CreateOrderView(generics.CreateAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def create(self, request, *args, **kwargs):
		paypal_transaction_id = (request.data.get('paypal_transaction_id') or '').strip()
		price_paid = request.data.get('price_paid')

		if not paypal_transaction_id:
			return Response({'detail': 'paypal_transaction_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

		if paypal_transaction_id.startswith('MOCK-'):
			if not settings.DEBUG:
				return Response({'detail': 'Mock transactions are disabled.'}, status=status.HTTP_400_BAD_REQUEST)
			return super().create(request, *args, **kwargs)

		is_valid, error_message = verify_paypal_order(paypal_transaction_id, price_paid)
		if not is_valid:
			return Response({'detail': error_message}, status=status.HTTP_400_BAD_REQUEST)

		return super().create(request, *args, **kwargs)

	def perform_create(self, serializer):
		serializer.save(buyer=self.request.user)


class UserOrderHistoryView(generics.ListAPIView):
	serializer_class = OrderSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return Order.objects.select_related('buyer', 'service', 'service__seller').filter(
			buyer=self.request.user
		).order_by('-date_purchased')
