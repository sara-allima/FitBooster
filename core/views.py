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