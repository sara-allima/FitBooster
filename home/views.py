from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home(request):
    return render(request, 'home/pages/home.html')
def cadastro(request):
    return render(request, 'home/pages/cadastro.html')
def formulario_treinador(request):
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