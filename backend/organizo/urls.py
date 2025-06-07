from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from usuarios.views import LoginAPI, RegisterAPI

urlpatterns = [
    path('admin/', admin.site.urls),
    path('usuarios/', include('usuarios.urls')),      # rotas web (HTML)
    path('api/', include('tarefas.urls')),   
    path('api/login/', LoginAPI.as_view()),           # rota API login
    path('api/register/', RegisterAPI.as_view()),     # rota API registro
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)