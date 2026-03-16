from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUserModel(AbstractUser):
	ROLE_ADMIN = 'Admin'
	ROLE_SELLER = 'Seller'
	ROLE_USER = 'User'

	ROLE_CHOICES = (
		(ROLE_ADMIN, 'Admin'),
		(ROLE_SELLER, 'Seller'),
		(ROLE_USER, 'User'),
	)

	email = models.EmailField(unique=True)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	phone_number = models.CharField(max_length=20, blank=True)
	location = models.CharField(max_length=255, blank=True)
	gender = models.CharField(max_length=30, blank=True)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_USER)
	merchant_id = models.CharField(max_length=120, blank=True)

	def __str__(self):
		return f'{self.username} ({self.role})'
