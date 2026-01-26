from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.models import User
from django.utils import timezone

from .decorators import treinador_required
from .models import Treinador, ConexaoAlunoTreinador


# =========================
# PÁGINAS PÚBLICAS
# =========================

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

            auth_login(request, user)
            return redirect('dashboard-alunos')

        except IntegrityError:
            return render(request, 'home/pages/formularioTreinador.html', {
                'erro': 'Erro ao cadastrar treinador. Email ou CPF já cadastrados.'
            })

    return render(request, 'home/pages/formularioTreinador.html')


# =========================
# AUTENTICAÇÃO
# =========================

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        user = authenticate(request, username=email, password=senha)

        if user is not None:
            auth_login(request, user)

            if Treinador.objects.filter(user=user).exists():
                return redirect('dashboard-alunos')
            else:
                return redirect('formTreinador')

        return render(request, 'home/pages/login.html', {
            'erro': 'Email ou senha inválidos.'
        })

    return render(request, 'home/pages/login.html')


def logout_view(request):
    logout(request)
    return redirect('desktop-login')


def redirecionar(request):
    return render(request, 'home/pages/redirect.html')


# =========================
# DASHBOARD TREINADOR
# =========================

@login_required
@treinador_required
def dashboard_alunos(request):
    treinador = Treinador.objects.get(user=request.user)

    pedidos = ConexaoAlunoTreinador.objects.filter(
        treinador=treinador,
        status='PENDENTE'
    ).select_related('aluno')

    return render(request, 'home/pages/dashboardAlunos.html', {
        'treinador': treinador,
        'pedidos': pedidos
    })


@login_required
@treinador_required
def dashboard_planos_treino(request):
    treinador = Treinador.objects.get(user=request.user)

    return render(request, 'home/pages/dashboardPlanosTreino.html', {
        'treinador': treinador
    })


@login_required
@treinador_required
def dashboard_relatorios(request):
    treinador = Treinador.objects.get(user=request.user)

    return render(request, 'home/pages/dashboardRelatorios.html', {
        'treinador': treinador
    })


# =========================
# AÇÕES DO TREINADOR
# =========================

@login_required
@treinador_required
def aceitar_pedido(request, pedido_id):
    pedido = get_object_or_404(
        ConexaoAlunoTreinador,
        id=pedido_id,
        treinador__user=request.user
    )

    if request.method == 'POST':
        pedido.status = 'ACEITA'
        pedido.data_resposta = timezone.now()
        pedido.save()

    return redirect('dashboard-alunos')

@login_required
@treinador_required
def recusar_pedido(request, pedido_id):
    pedido = get_object_or_404(
        ConexaoAlunoTreinador,
        id=pedido_id,
        treinador__user=request.user
    )

    if request.method == 'POST':
        pedido.status = 'RECUSADA'
        pedido.data_resposta = timezone.now()
        pedido.save()

    return redirect('dashboard-alunos')

