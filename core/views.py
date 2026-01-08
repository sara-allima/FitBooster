from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from home.models import Aluno
from django.http import HttpResponse

def index(request):
    return render(request, 'core/index.html')

def form(request):
    return render(request, 'core/form.html')

def home(request):
    return render(request,  'core/home.html')

def note(request):
    return render(request, 'core/note.html')

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

def registro(request):
    if request.mothod == 'POST':
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')
        genero = request.POST.get('genero')
        idade = request.POST.get('idade')
        peso = request.POST.get('peso')
        altura = request.POST.get('altura')
        objetivo = request.POST.get('objetivo')

        if senha != confirmar_senha:
            return render(request, 'core/registro.html', {
                'erro': 'Senhas não coincidem'
            })
        
        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=senha
            )
            Aluno = Aluno.objects.create(
                user=user,
                nome=nome,
                email=email,
                genero=genero,
                idade=idade,
                peso=peso,
                altura=altura,
                objetivo=objetivo 
            )
            return redirect('login')
        except IntegrityError:
            return render(request, 'core/registro.html', {
                'erro': 'Email já cadastrado'
            })
        
    return render(request, 'core/registro.html')

def clicar(request):
    return render(request, 'core/clicartreino.html')

def corpo(request):
    return render(request, 'core/corpo.html')

def escolher(request):
    return render(request, 'core/escolher.html')

def reg(request):
    return render(request, 'core/reg.html')

def tela(request):
    return render(request, 'core/tela.html')

def list(request):
    return render(request, 'core/list.html')
