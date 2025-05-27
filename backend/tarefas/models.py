import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Tag(models.Model):
    nome = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nome

class Tarefa(models.Model):
    PRIORIDADE_CHOICES = [
        ('baixa', 'Baixa'),
        ('media', 'Média'),
        ('alta', 'Alta')
    ]
    RECORRENCIA_CHOICES = [
        ('diaria', 'Diária'),
        ('semanal', 'Semanal'),
        ('mensal', 'Mensal'),
        ('anual', 'Anual')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tarefas')
    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    concluida = models.BooleanField(default=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    data_conclusao = models.DateTimeField(blank=True, null=True)
    prioridade = models.CharField(max_length=10, choices=PRIORIDADE_CHOICES, default='media')
    data_limite = models.DateTimeField(blank=True, null=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    responsavel = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tarefas_responsaveis')
    anexo = models.FileField(upload_to='tarefas/anexos/', blank=True, null=True)
    tags = models.ManyToManyField('Tag', blank=True, related_name='tarefas')
    lembrete = models.DateTimeField(blank=True, null=True)
    recorrente = models.BooleanField(default=False)
    recorrencia = models.CharField(max_length=50, blank=True, null=True, choices=RECORRENCIA_CHOICES)
    subtarefas = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='subtarefas_de')
    concluida_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tarefas_concluidas')
    lembrete_enviado = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'
        ordering = ['-data_criacao']

class Anotacao(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='anotacoes')
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Anotação de {self.usuario}'

    class Meta:
        verbose_name = 'Anotação'
        verbose_name_plural = 'Anotações'
        ordering = ['-data_criacao']