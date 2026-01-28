from django.urls import path
from .views import login_view
from home.views import *

urlpatterns = [
    # Páginas Públicas e Cadastro
    path('', home),
    path('cadastro/', cadastro, name="cadastro"),
    path('inscrever/', formulario_treinador, name="formTreinador"),

    # Dashboards
    path('dashboard/alunos/', dashboard_alunos, name="dashboard-alunos"),
    path('dashboard-planos-de-treino/', dashboard_planos_treino, name="dashboard-planos-treino"),
    path('dashboard-relatorios/', dashboard_relatorios, name="dashboard-relatorios"),

    # Ações de Pedidos
    path('pedido/<int:pedido_id>/aceitar/', aceitar_pedido, name='aceitar_pedido'),
    path('pedido/<int:pedido_id>/recusar/', recusar_pedido, name='recusar_pedido'),

    # Autenticação
    path('login/', login_view, name='desktop-login'),
    path('redirect/', redirecionar, name="redirect"),
    path('logout/', logout_view, name='logout'),

    # Criação de Treinos e Exercícios
    path('treino/criar/', criar_treino, name='criar_treino'),
    path('exercicios/', listar_exercicios, name='listar_exercicios'),

    # Busca de Alunos
    path('alunos/buscar/', buscar_alunos, name='buscar_alunos'),

    # 👇 ADICIONEI ESTAS DUAS ROTAS NOVAS AQUI:
    path('treino/atribuir/', atribuir_treino, name='atribuir_treino'),
    path('treino/alunos/<int:treino_id>/', get_alunos_treino, name='get_alunos_treino'),
    path('treino/remover-aluno/', remover_aluno_treino, name='remover_aluno_treino'),

    path('aluno/desconectar/', desconectar_aluno, name='desconectar_aluno'),
    path('treino/deletar/<int:treino_id>/', deletar_treino, name='deletar_treino'),
]  