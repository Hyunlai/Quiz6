from rest_framework import permissions


class IsAdminRoleOrStaff(permissions.BasePermission):
	"""Allows access to users with role='Admin' or is_staff=True."""

	def has_permission(self, request, view):
		return bool(
			request.user and
			request.user.is_authenticated and
			(request.user.is_staff or getattr(request.user, 'role', None) == 'Admin')
		)
