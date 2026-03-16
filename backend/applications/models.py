from django.conf import settings
from django.db import models


class SellerApplication(models.Model):
	STATUS_PENDING = 'Pending'
	STATUS_APPROVED = 'Approved'
	STATUS_DECLINED = 'Declined'

	STATUS_CHOICES = (
		(STATUS_PENDING, 'Pending'),
		(STATUS_APPROVED, 'Approved'),
		(STATUS_DECLINED, 'Declined'),
	)

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seller_applications')
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
	decline_reason = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.user.username} - {self.status}'
