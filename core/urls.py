from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('form/', views.form, name="form"),
    path('home/', views.home, name="home"),
    path('note/', views.note, name="note"),
    path('perfil/', views.perfil, name="perfil"),
    path('login/', views.login, name="mobile-login"),
    path('registro/', views.registro, name="registro"),
    path('clicar/', views.clicar, name="clicar"),
    path('corpo/', views.corpo, name="corpo"),
    path('escolher/', views.escolher, name="escolher"),
    path('reg/', views.reg, name="reg"),
    path('tela/', views.tela, name="tela"),
    path('logout/', views.logout_view, name="mobile-logout"),
    path('treino/', views.treino, name="treino"),
    path('treinoa/', views.treinoa, name="treinoa"),
    path('calendario/', views.calendario, name="calendario"),
    path('treinadores/', views.treinadores, name="treinadores"),
    path('conexoes/', views.listar_conexoes, name='listar-conexoes'),
    path('conexoes/solicitar/', views.solicitar_treinador, name='solicitar-treinador'),
    path('conexoes/encerrar/', views.encerrar_conexao, name='encerrar-conexao'),
    path(
    'treinadores/solicitar/<str:cref>/',
    views.solicitar_treinador,
    name='solicitar-treinador'
    ),

    ]


