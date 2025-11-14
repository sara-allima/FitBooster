from django.urls import path, include
from home.views import *

urlpatterns = [
    path('', home),
    path('cadastro/', cadastro, name="cadastro"),
    path('inscrever/', formularioTreinador, name="formTreinador")
]