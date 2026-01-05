from django.shortcuts import redirect
from .models import Treinador

def treinador_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        try:
            Treinador.objects.get(user=request.user)
        except Treinador.DoesNotExist:
            return redirect('cadastro')
        
        return view_func(request, *args, **kwargs)
    return _wrapped_view