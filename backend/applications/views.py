from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import CustomUserModel
from users.permissions import IsAdminRoleOrStaff

from .models import SellerApplication
from .serializers import SellerApplicationSerializer


class SubmitApplicationView(generics.CreateAPIView):
	serializer_class = SellerApplicationSerializer
	permission_classes = [permissions.IsAuthenticated]

	def create(self, request, *args, **kwargs):
		existing = SellerApplication.objects.filter(
			user=request.user,
			status=SellerApplication.STATUS_PENDING,
		).exists()
		if existing:
			return Response({'detail': 'You already have a pending application.'}, status=status.HTTP_400_BAD_REQUEST)

		instance = SellerApplication.objects.create(user=request.user)
		serializer = self.get_serializer(instance)
		return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListApplicationView(generics.ListAPIView):
	serializer_class = SellerApplicationSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.is_staff or self.request.user.role == CustomUserModel.ROLE_ADMIN:
			return SellerApplication.objects.select_related('user').order_by('-created_at')
		return SellerApplication.objects.select_related('user').filter(user=self.request.user).order_by('-created_at')


class ApproveApplicationView(APIView):
	permission_classes = [IsAdminRoleOrStaff]

	def post(self, request, pk):
		merchant_id = request.data.get('merchant_id', '').strip()
		if not merchant_id:
			return Response({'detail': 'merchant_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

		application = get_object_or_404(SellerApplication, pk=pk)
		application.status = SellerApplication.STATUS_APPROVED
		application.decline_reason = ''
		application.save(update_fields=['status', 'decline_reason'])

		user = application.user
		user.role = CustomUserModel.ROLE_SELLER
		user.merchant_id = merchant_id
		user.save(update_fields=['role', 'merchant_id'])

		return Response({'detail': 'Application approved.'})


class DeclineApplicationView(APIView):
	permission_classes = [IsAdminRoleOrStaff]

	def post(self, request, pk):
		reason = request.data.get('decline_reason', '').strip()
		if not reason:
			return Response({'detail': 'decline_reason is required.'}, status=status.HTTP_400_BAD_REQUEST)

		application = get_object_or_404(SellerApplication, pk=pk)
		application.status = SellerApplication.STATUS_DECLINED
		application.decline_reason = reason
		application.save(update_fields=['status', 'decline_reason'])

		return Response({'detail': 'Application declined.'})
