from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required
from home.models import Aluno
from django.http import HttpResponse
from decimal import Decimal, InvalidOperation
from home.decorators import aluno_required
from home.models import Treinador, ConexaoAlunoTreinador
from django.http import JsonResponse
from django.utils import timezone
import json
from django.shortcuts import get_object_or_404

def index(request):
    return render(request, 'core/index.html')

def form(request):
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')
        genero = request.POST.get('genero')
        objetivo = request.POST.get('objetivo')

        # Conversões seguras
        try:
            idade = int(request.POST.get('idade'))
            peso = Decimal(request.POST.get('peso').replace(',', '.'))
            altura = Decimal(request.POST.get('altura').replace(',', '.'))
        except (TypeError, ValueError, InvalidOperation, AttributeError):
            return render(request, 'core/form.html', {
                'erro': 'Preencha corretamente idade, peso e altura.'
            })

        # Validação de senha
        if senha != confirmar_senha:
            return render(request, 'core/form.html', {
                'erro': 'Senhas não coincidem.'
            })

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=senha
            )

            Aluno.objects.create(
                user=user,
                nome=nome,
                email=email,
                genero=genero,
                idade=idade,
                peso=peso,
                altura=altura,
                objetivo=objetivo
            )

            return redirect('mobile-login')

        except IntegrityError:
            return render(request, 'core/form.html', {
                'erro': 'Email já cadastrado.'
            })

    return render(request, 'core/form.html')

@login_required(login_url='mobile-login')
@aluno_required
def home(request):
    return render(request,  'core/home.html')

@login_required(login_url='mobile-login')
@aluno_required
def note(request):
    return render(request, 'core/note.html')

@login_required(login_url='mobile-login')
@aluno_required
def perfil(request):
    return render(request, 'core/perfil.html')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        user = authenticate(request, username=email, password=senha)

        if user:
            auth_login(request, user)

            if Aluno.objects.filter(user=user).exists():
                return redirect('home')
            
        return render(request, 'core/login.html', {
            'erro': 'Email ou senha inválidos.'
        })
    
    return render(request, 'core/login.html')

@login_required(login_url='mobile-login')
@aluno_required
def registro(request):
    return render(request, 'core/registro.html')

@login_required(login_url='mobile-login')
@aluno_required
def clicar(request):
    return render(request, 'core/clicartreino.html')

@login_required(login_url='mobile-login')
@aluno_required
def corpo(request):
    return render(request, 'core/corpo.html')

@login_required(login_url='mobile-login')
@aluno_required
def escolher(request):
    return render(request, 'core/escolher.html')

@login_required(login_url='mobile-login')
@aluno_required
def reg(request):
    return render(request, 'core/reg.html')

@login_required(login_url='mobile-login')
@aluno_required
def tela(request):
    return render(request, 'core/tela.html')

def logout_view(request):
    logout(request)
    return redirect('mobile-login')

def list(request):
    return render(request, 'core/list.html')

@login_required(login_url='mobile-login')
@aluno_required
def treino(request):
    return render(request, 'core/treino.html')

@login_required(login_url='mobile-login')
@aluno_required
def treinoa(request):
    return render(request, 'core/treinoA.html')

@login_required(login_url='mobile-login')
@aluno_required
def calendario(request):
    return render(request, 'core/calendario.html')

@login_required(login_url='mobile-login')
@aluno_required
def treinadores(request):
    aluno = request.user.aluno

    conexoes = ConexaoAlunoTreinador.objects.filter(aluno=aluno)

    treinadores = Treinador.objects.all()

    return render(request, 'core/treinadores.html', {
        'treinadores': treinadores,
        'conexoes': conexoes,
    })




@login_required(login_url='mobile-login')
@aluno_required
def solicitar_treinador(request, cref):
    aluno = request.user.aluno
    treinador = get_object_or_404(Treinador, cref=cref)

    conexao, criada = ConexaoAlunoTreinador.objects.get_or_create(
        aluno=aluno,
        treinador=treinador,
        defaults={'status': 'PENDENTE'}
    )

    return redirect('treinadores')



@login_required(login_url='mobile-login')
@aluno_required
def listar_conexoes(request):
    aluno = request.user.aluno

    conexoes = ConexaoAlunoTreinador.objects.filter(
        aluno=aluno,
        status__in=['PENDENTE', 'ACEITA']
    )

    data = []
    for c in conexoes:
        data.append({
            'id': c.id,
            'nome': c.treinador.nome,
            'cref': c.treinador.cref,
            'status': c.status
        })

    return JsonResponse(data, safe=False)

@login_required
def encerrar_conexao(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método inválido'}, status=400)

    body = json.loads(request.body)
    conexao_id = body.get('id')

    conexao = get_object_or_404(ConexaoAlunoTreinador, id=conexao_id)

    # segurança: só aluno ou treinador da conexão
    user = request.user
    if hasattr(user, 'aluno') and conexao.aluno == user.aluno:
        pass
    elif hasattr(user, 'treinador') and conexao.treinador == user.treinador:
        pass
    else:
        return JsonResponse({'erro': 'Sem permissão'}, status=403)

    conexao.status = 'ENCERRADA'
    conexao.data_encerramento = timezone.now()
    conexao.save()

    return JsonResponse({'sucesso': True})
