from django.shortcuts import render
from django.http import HttpResponse

def login(request):
    return render(request, 'core/login.html')

def registro(request):
    return render(request, 'core/registro.html')