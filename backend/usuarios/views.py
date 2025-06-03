from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class LoginAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(request, username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({"token": str(refresh.access_token)})
        return Response({"detail": "Credenciais inválidas"}, status=400)

class RegisterAPI(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        nome = request.data.get("nome")
        email = request.data.get("email")
        password = request.data.get("password")
        if not all([nome, email, password]):
            return Response({"detail": "Dados incompletos"}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "E-mail já cadastrado"}, status=400)
        user = User.objects.create_user(username=email, email=email, password=password, first_name=nome)
        refresh = RefreshToken.for_user(user)
        return Response({"token": str(refresh.access_token)})
    

class UsuarioViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "nome": user.first_name,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_active": user.is_active,
        }
        return Response(data)

    def put(self, request):
        user = request.user
        nome = request.data.get("nome")
        email = request.data.get("email")
        if nome:
            user.first_name = nome
        if email:
            user.email = email
        user.save()
        return Response({"detail": "Usuário atualizado com sucesso"})