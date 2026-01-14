from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('form/', views.form, name="form"),
    path('home/', views.home, name="home"),
    path('note/', views.note, name="note"),
    path('perfil/', views.perfil, name="perfil"),
    path('login/', views.login, name="login"),
    path('registro/', views.registro, name="registro"),
    path('clicar/', views.clicar, name="clicar"),
    path('corpo/', views.corpo, name="corpo"),
    path('escolher/', views.escolher, name="escolher"),
    path('reg/', views.reg, name="reg"),
    path('tela/', views.tela, name="tela"),
    path('list/', views.list, name="list"),
    path('treino/', views.treino, name="treino"),
    path('treinoa/', views.treinoa, name="treinoa"),
    path('calendario/', views.calendario, name="calendario"),
    path('treinadores/', views.treinadores, name="treinadores"),
    ]
