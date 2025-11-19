from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name="login"),
    path('registro/', views.registro, name="registro")
]
