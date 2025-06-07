from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .models import Tarefa
from .serializers import TarefaSerializer
# Create your views here.
class DashboardAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"mensagem": f"Bem-vindo, {request.user.first_name}!"})
    
class TarefaViewSet(ModelViewSet):
    queryset = Tarefa.objects.all().order_by('-id')
    serializer_class = TarefaSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
    lookup_field = 'id'

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
  