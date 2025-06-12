# serializers.py
from rest_framework import serializers
from .models import Tarefa
from django.utils import timezone

class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = '__all__'

    def update(self, instance, validated_data):
        concluida = validated_data.get('concluida', instance.concluida)
        if concluida and not instance.concluida:
            instance.data_conclusao = timezone.now()  # <-- Adicione esta linha!
        elif not concluida and instance.concluida:
            instance.data_conclusao = None           # <-- E esta!
        return super().update(instance, validated_data)