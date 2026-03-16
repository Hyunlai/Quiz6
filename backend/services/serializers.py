from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    name_of_the_expert = serializers.SerializerMethodField()
    price_value = serializers.SerializerMethodField()
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id',
            'seller',
            'seller_name',
            'name_of_the_expert',
            'service_name',
            'description',
            'price',
            'price_value',
            'price_display',
            'duration_of_service',
            'sample_image',
            'rating',
        ]
        read_only_fields = ['seller', 'seller_name', 'name_of_the_expert', 'price_value', 'price_display']

    def get_name_of_the_expert(self, obj):
        full_name = obj.seller.get_full_name()
        return full_name.strip() if full_name.strip() else obj.seller.username

    def get_price_value(self, obj):
        return float(obj.price)

    def get_price_display(self, obj):
        return f'PHP {float(obj.price):,.0f}'