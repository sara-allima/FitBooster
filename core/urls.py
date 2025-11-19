from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name="login"),
    path('registro/', views.registro, name="registro"),
    path('clicar/', views.clicar, name="clicar"),
    path('corpo/', views.corpo, name="corpo"),
    path('escolher/', views.escolher, name="escolher"),
    path('reg/', views.reg, name="reg"),
    path('tela/', views.tela, name="tela")
]
