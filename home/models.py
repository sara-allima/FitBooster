from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Treino(models.Model):
    treino_id = models.IntegerField(primary_key=True)
    #aluno_id = models.ForeignKey(
        #Tem que ver como pega isso do User que vai ser o aluno   
    #)
    #treinador_id = models.ForeignKey(
        #Mesma coisa que o aluno_id   
    #)
    nome_treino = models.CharField(max_length=100)
    descricao = models.TextField()
    data_criacao = models.DateField(auto_now_add=True)
    tipo_treino = models.CharField(max_length=30)
    exercicios = models.ManyToManyField(
        Exercicio,
        through='TreinoExercicio'
    )

    def __str__(self):
        return self.nome_treino

class Exercicio(models.Model):
    exercicio_id = models.IntegerField(primary_key=True)
    nome_exercicio = models.CharField(max_length=25)
    grupo_muscular = models.CharField(max_length=50)
    descricao = models.TextField()
    series = models.IntegerField(default=3)
    repeticoes = models.IntegerField(default=12)
    carga = models.IntegerField(default=1)

    def __str__(self):
        return self.nome_exercicio

class TreinoExercicio(models.Model):
    treino_id = models.ForeignKey(
        Treino,
        on_delete=models.CASCADE
    )
    exercicio_id = models.ForeignKey(
        Exercicio,
        on_delete=models.CASCADE
    )
