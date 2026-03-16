from django.conf import settings
from django.db import models


class Service(models.Model):
	seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='services')
	service_name = models.CharField(max_length=255)
	description = models.TextField()
	price = models.DecimalField(max_digits=12, decimal_places=2)
	duration_of_service = models.CharField(max_length=120)
	sample_image = models.URLField(blank=True, default='')
	rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)

	def __str__(self):
		return self.service_name
