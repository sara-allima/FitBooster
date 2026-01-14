from django.urls import path, include
from home.views import *

urlpatterns = [
    path('', home),
    path('cadastro/', cadastro, name="cadastro"),
    path('inscrever/', formulario_treinador, name="formTreinador"),
    path('dashboard-alunos/', dashboard_alunos, name="dashboard-alunos"),
    path('dashboard-planos-de-treino/', dashboard_planos_treino, name="dashboard-planos-treino"),
    path('dashboard-relatorios/', dashboard_relatorios, name="dashboard-relatorios"),
    path('login/', login, name="desktop-login"),
    path('redirect/', redirecionar, name="redirect"),
    path('logout/', logout_view, name='logout'),
]