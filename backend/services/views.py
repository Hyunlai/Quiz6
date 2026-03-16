from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from users.models import CustomUserModel

from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
	queryset = Service.objects.select_related('seller').order_by('-id')
	serializer_class = ServiceSerializer
	permission_classes = [permissions.AllowAny]


class ServiceDetailView(generics.RetrieveAPIView):
	queryset = Service.objects.select_related('seller')
	serializer_class = ServiceSerializer
	permission_classes = [permissions.AllowAny]


class SellerServiceManageView(generics.ListCreateAPIView):
	serializer_class = ServiceSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.is_staff or self.request.user.role == CustomUserModel.ROLE_ADMIN:
			return Service.objects.select_related('seller').order_by('-id')
		return Service.objects.select_related('seller').filter(seller=self.request.user).order_by('-id')

	def perform_create(self, serializer):
		if self.request.user.role not in [CustomUserModel.ROLE_SELLER, CustomUserModel.ROLE_ADMIN]:
			raise PermissionDenied('Only Seller or Admin accounts can create services.')
		serializer.save(seller=self.request.user)


class SellerServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = ServiceSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		if self.request.user.is_staff or self.request.user.role == CustomUserModel.ROLE_ADMIN:
			return Service.objects.select_related('seller').all()
		return Service.objects.select_related('seller').filter(seller=self.request.user)
