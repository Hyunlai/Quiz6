from rest_framework import serializers

from services.models import Service
from services.serializers import ServiceSerializer
from users.serializers import UserSerializer

from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    buyer = UserSerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(source='service', queryset=Service.objects.all(), write_only=True)
    service_name = serializers.CharField(source='service.service_name', read_only=True)
    created_at = serializers.DateTimeField(source='date_purchased', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'buyer',
            'service',
            'service_id',
            'service_name',
            'paypal_transaction_id',
            'price_paid',
            'date_purchased',
            'created_at',
        ]
        read_only_fields = ['date_purchased', 'created_at']