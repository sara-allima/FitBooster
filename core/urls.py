from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('form/', views.form, name="form"),
    path('home/', views.home, name="home"),
    path('note/', views.note, name="note"),
    path('perfil/', views.perfil, name="perfil"),
]
