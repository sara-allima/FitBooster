from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Treinador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cref = models.CharField(primary_key=True, max_length=20)
    nome = models.CharField(max_length=100)
    genero = models.CharField(max_length=20, choices=[
        ('Masculino'),
        ('Feminino'),
        ('Outro')
    ])
    email = models.EmailField(unique=True)
    cpf = models.CharField(max_length=11, unique=True)
    formacao = models.TextField()
    idade = models.IntegerField()

    def __str__(self):
        return self.nome or self.user.username

class Aluno(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100)
    genero = models.CharField(max_length=20, choices=[
        ('Masculino'),
        ('Feminino'),
        ('Outro')
    ])
    email = models.EmailField(unique=True)
    objetivo = models.CharField(max_length=100)
    peso = models.DecimalField(max_digits=5, decimal_places=2)
    altura = models.DecimalField(max_digits=4, decimal_places=2)
    idade = models.IntegerField()
    treinador = models.ForeignKey(
        Treinador,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alunos'
    )

    def __str__(self):
        return self.nome or self.user.username

class Exercicio(models.Model):
    nome = models.CharField(max_length=100)
    grupo_muscular = models.CharField(max_length=50)
    descricao = models.TextField()
    series = models.IntegerField(default=3)
    repeticoes = models.IntegerField(default=12)
    carga = models.IntegerField(default=0, help_text='Carga em Kg')
    
    def __str__(self):
        return f'{self.nome} - {self.grupo_muscular}'
    
class Treino(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    tipo = models.CharField(max_length=50)
    data_criacao = models.DateField(auto_now_add=True)
    treinador = models.ForeignKey(
        Treinador,
        on_delete=models.CASCADE,
        related_name='treinos_criados'
    )
    alunos = models.ManyToManyField(
        Aluno,
        through='AlunoTreino',
        through_fields=('treino', 'aluno'),
        related_name='treinos'
    )
    exercicios = models.ManyToManyField(
        Exercicio,
        through='TreinoExercicio',
        through_fields=('treino', 'exercicio'),
        related_name='treinos'
    )

    def __str__(self):
        return f'{self.nome} - {self.tipo}'