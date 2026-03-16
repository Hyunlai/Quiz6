from django.urls import path

from .views import AIChatbotView

urlpatterns = [
    path('ask/', AIChatbotView.as_view(), name='chat-ask'),
]