from django.shortcuts import render
from django.http import HttpResponse

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