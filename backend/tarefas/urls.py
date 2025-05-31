from django.urls import path
from .views import DashboardAPI

urlpatterns = [
    path("dashboard/", DashboardAPI.as_view(), name="dashboard-api"),
]