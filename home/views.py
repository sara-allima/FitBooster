from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def home(request):
    return render(request, 'home/pages/home.html')
def cadastro(request):
    return render(request, 'home/pages/cadastro.html')