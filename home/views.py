from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth.models import User
from .models import Treinador

# Create your views here.
def home(request):
    return render(request, 'home/pages/home.html')

def cadastro(request):
    return render(request, 'home/pages/cadastro.html')

def formulario_treinador(request):
    if request.method == 'POST':
        cref = request.POST.get('cref')
        nome = request.POST.get('nome')
        genero = request.POST.get('genero')
        email = request.POST.get('email')
        cpf = request.POST.get('cpf')
        formacao = request.POST.get('formacao')
        idade = int(request.POST.get('idade'))
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')

        if senha != confirmar_senha:
            return render(request, 'home/pages/formularioTreinador.html', {
                'erro': 'As senhas não coincidem.'
            })

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=senha
            )
            Treinador.objects.create(
                user=user,
                nome=nome,
                email=email,
                cpf=cpf,
                idade=idade,
                genero=genero,
                cref=cref,
                formacao=formacao
            )

            return redirect('dashboard-alunos')
        
        except IntegrityError:
            return render(request, 'home/pages/formularioTreinador.html', {
                'erro': 'Erro ao cadastrar treinador. Email ou CPF já cadastrados.'
            })
        
    return render(request, 'home/pages/formularioTreinador.html')

def dashboard_alunos(request):
    return render(request, 'home/pages/dashboardAlunos.html')
def dashboard_planos_treino(request):
    return render(request, 'home/pages/dashboardPlanosTreino.html')
def dashboard_relatorios(request):
    return render(request, "home/pages/dashboardRelatorios.html")
def login(request):
    return render(request, "home/pages/login.html")
def redirect(request):
    return render(request, "home/pages/redirect.html")