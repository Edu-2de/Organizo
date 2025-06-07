from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DashboardAPI, TarefaViewSet

router = DefaultRouter()
router.register(r'tarefas', TarefaViewSet, basename='tarefa')

urlpatterns = [
    path("dashboard/", DashboardAPI.as_view(), name="dashboard-api"),
    path("", include(router.urls)),  # Adicione esta linha
]