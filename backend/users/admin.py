from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUserModel


@admin.register(CustomUserModel)
class CustomUserAdmin(UserAdmin):
	fieldsets = UserAdmin.fieldsets + (
		(
			'Marketplace',
			{
				'fields': ('phone_number', 'location', 'gender', 'role', 'merchant_id'),
			},
		),
	)
