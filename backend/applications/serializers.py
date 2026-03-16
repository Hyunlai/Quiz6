from rest_framework import serializers

from .models import SellerApplication


class SellerApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = SellerApplication
        fields = ['id', 'user', 'user_email', 'username', 'status', 'decline_reason', 'created_at']
        read_only_fields = ['status', 'decline_reason', 'created_at', 'user']