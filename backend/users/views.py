from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUserModel
from .permissions import IsAdminRoleOrStaff
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer


class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
	serializer_class = RegisterSerializer
	permission_classes = [permissions.AllowAny]


class UserProfileView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response(serializer.data)


class AdminUserListView(generics.ListAPIView):
	serializer_class = UserSerializer
	permission_classes = [IsAdminRoleOrStaff]
	queryset = CustomUserModel.objects.all().order_by('-id')


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer
	permission_classes = [IsAdminRoleOrStaff]
	queryset = CustomUserModel.objects.all()
