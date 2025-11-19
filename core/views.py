from django.shortcuts import render
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
    return render(request, 'core/login.html')

def registro(request):
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
