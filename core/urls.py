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
    path('perfil/foto/', views.atualizar_foto, name='atualizar-foto'),
    path('perfil/nome/', views.atualizar_nome, name='atualizar-nome'),
    path('corpo/salvar-peso/', views.salvar_peso, name='salvar-peso'),
    path('corpo/salvar-medidas/', views.salvar_medidas, name='salvar-medidas'),
    path(
        'treinadores/disponiveis/',
        views.treinadores_disponiveis,
        name='treinadores-disponiveis'
    ),
    path(
        'treino/<int:treino_id>/',
        views.detalhe_treino,
        name='detalhe-treino'
    ),
    path(
    'mobile/exercicio/<int:id>/',
    views.exercicio_detalhe,
    name='exercicio_detalhe'
    ),
    path(
    'mobile/exercicio/<int:id>/concluir/',
    views.concluir_exercicio,
    name='concluir_exercicio'
    ),


    ]


