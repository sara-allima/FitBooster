from django.shortcuts import redirect
from .models import Treinador, Aluno
from functools import wraps

def treinador_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        try:
            Treinador.objects.get(user=request.user)
        except Treinador.DoesNotExist:
            return redirect('cadastro')
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view

def aluno_required(view_func):
    @wraps(view_func)
    def _wrapper_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')
        
        if not Aluno.objects.filter(user=request.user).exists():
            return redirect('login')
        
        return view_func(request, *args, **kwargs)
    return _wrapper_view