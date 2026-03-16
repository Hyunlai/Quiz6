from django.urls import path

from .views import ApproveApplicationView, DeclineApplicationView, ListApplicationView, SubmitApplicationView

urlpatterns = [
    path('apply/', SubmitApplicationView.as_view(), name='apply'),
    path('list/', ListApplicationView.as_view(), name='list-applications'),
    path('<int:pk>/approve/', ApproveApplicationView.as_view(), name='approve-application'),
    path('<int:pk>/decline/', DeclineApplicationView.as_view(), name='decline-application'),
]