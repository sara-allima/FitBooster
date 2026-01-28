from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.models import User
from django.utils import timezone

from .decorators import treinador_required
from .models import Treinador, ConexaoAlunoTreinador

from .models import Treino, Aluno, Exercicio, TreinoExercicio, AlunoTreino, DiaTreinoAluno
from django.http import JsonResponse
import json



# =========================
# PÁGINAS PÚBLICAS
# =========================

def home(request):
    return render(request, 'home/pages/home.html')


def cadastro(request):
    return render(request, 'home/pages/cadastro.html')


def formulario_treinador(request):
    if request.method == 'POST':
        cref = request.POST.get('cref')
        nome = request.POST.get('nome')
        genero = request.POST.get('genero')
        email = request.POST.get('email')
        cpf = request.POST.get('cpf')
        formacao = request.POST.get('formacao')
        idade = int(request.POST.get('idade'))
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')

        if senha != confirmar_senha:
            return render(request, 'home/pages/formularioTreinador.html', {
                'erro': 'As senhas não coincidem.'
            })

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=senha
            )

            Treinador.objects.create(
                user=user,
                nome=nome,
                email=email,
                cpf=cpf,
                idade=idade,
                genero=genero,
                cref=cref,
                formacao=formacao
            )

            auth_login(request, user)
            return redirect('dashboard-alunos')

        except IntegrityError:
            return render(request, 'home/pages/formularioTreinador.html', {
                'erro': 'Erro ao cadastrar treinador. Email ou CPF já cadastrados.'
            })

    return render(request, 'home/pages/formularioTreinador.html')


# =========================
# AUTENTICAÇÃO
# =========================

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        user = authenticate(request, username=email, password=senha)

        if user is not None:
            auth_login(request, user)

            if Treinador.objects.filter(user=user).exists():
                return redirect('dashboard-alunos')
            else:
                return redirect('formTreinador')

        return render(request, 'home/pages/login.html', {
            'erro': 'Email ou senha inválidos.'
        })

    return render(request, 'home/pages/login.html')


def logout_view(request):
    logout(request)
    return redirect('desktop-login')


def redirecionar(request):
    return render(request, 'home/pages/redirect.html')


# =========================
# DASHBOARD TREINADOR
# =========================
@login_required
@treinador_required
def dashboard_alunos(request):
    treinador = Treinador.objects.get(user=request.user)

    pedidos = ConexaoAlunoTreinador.objects.filter(
        treinador=treinador,
        status='PENDENTE'
    ).select_related('aluno')

    alunos = Aluno.objects.filter(
        conexoes__treinador=treinador,
        conexoes__status='ACEITA'
    ).distinct()

    return render(request, 'home/pages/dashboardAlunos.html', {
        'treinador': treinador,
        'pedidos': pedidos,
        'alunos': alunos
    })



@login_required
@treinador_required
def dashboard_planos_treino(request):
    treinador = Treinador.objects.get(user=request.user)

    treinos = Treino.objects.filter(
        treinador=treinador
    ).prefetch_related('treinoexercicio_set')

    alunos = Aluno.objects.filter(
        conexoes__treinador=treinador,
        conexoes__status='ACEITA'
    ).distinct()

    return render(request, 'home/pages/dashboardPlanosTreino.html', {
        'treinador': treinador,
        'treinos': treinos,
        'alunos': alunos
    })




@login_required
@treinador_required
def dashboard_relatorios(request):
    treinador = Treinador.objects.get(user=request.user)

    return render(request, 'home/pages/dashboardRelatorios.html', {
        'treinador': treinador
    })

from home.models import ConexaoAlunoTreinador



# =========================
# AÇÕES DO TREINADOR
# =========================

@login_required
@treinador_required
def aceitar_pedido(request, pedido_id):
    pedido = get_object_or_404(
        ConexaoAlunoTreinador,
        id=pedido_id,
        treinador__user=request.user
    )

    if request.method == 'POST':
        pedido.status = 'ACEITA'
        pedido.data_resposta = timezone.now()
        pedido.save()

    return redirect('dashboard-alunos')

@login_required
@treinador_required
def recusar_pedido(request, pedido_id):
    pedido = get_object_or_404(
        ConexaoAlunoTreinador,
        id=pedido_id,
        treinador__user=request.user
    )

    if request.method == 'POST':
        pedido.status = 'RECUSADA'
        pedido.data_resposta = timezone.now()
        pedido.save()

    return redirect('dashboard-alunos')





@login_required
@treinador_required
def criar_treino(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    treinador = Treinador.objects.get(user=request.user)

    try:
        data = json.loads(request.body)

        nome = data.get('nome')
        tipo = data.get('tipo', 'Personalizado')
        exercicios = data.get('exercicios', [])

        if not nome or not exercicios:
            return JsonResponse({'error': 'Dados incompletos'}, status=400)

        # 1️⃣ Criar o treino
        treino = Treino.objects.create(
            nome=nome,
            descricao='Treino criado pelo dashboard',
            tipo=tipo,
            treinador=treinador
        )

        # 2️⃣ Criar relação treino + exercícios
        for ex in exercicios:
            exercicio = Exercicio.objects.get(id=ex['id'])

            TreinoExercicio.objects.create(
                treino=treino,
                exercicio=exercicio,
                series=ex.get('series', exercicio.series),
                repeticoes=ex.get('repeticoes', exercicio.repeticoes),
                carga=ex.get('carga', exercicio.carga)
            )

        return JsonResponse({
            'success': True,
            'treino_id': treino.id,
            'treino_nome': treino.nome
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@login_required
@treinador_required
def listar_exercicios(request):
    exercicios = Exercicio.objects.all().values('id', 'nome')
    return JsonResponse(list(exercicios), safe=False)


def relatorio_aluno(request, aluno_id):
    aluno = get_object_or_404(Aluno, id=aluno_id)

    return JsonResponse({
        "nome": aluno.nome,
        "objetivo": aluno.objetivo,
        "peso": float(aluno.peso),
        "meta_peso": float(aluno.meta_peso) if aluno.meta_peso else None,
        "altura": float(aluno.altura),

        # MEDIDAS
        "ombros": float(aluno.ombros) if aluno.ombros else None,
        "peito": float(aluno.peito) if aluno.peito else None,

        "antebraco_esquerdo": float(aluno.antebraco_esquerdo) if aluno.antebraco_esquerdo else None,
        "antebraco_direito": float(aluno.antebraco_direito) if aluno.antebraco_direito else None,

        "braco_esquerdo": float(aluno.braco_esquerdo) if aluno.braco_esquerdo else None,
        "braco_direito": float(aluno.braco_direito) if aluno.braco_direito else None,

        "cintura": float(aluno.cintura) if aluno.cintura else None,
        "quadril": float(aluno.quadril) if aluno.quadril else None,

        "perna_esquerda": float(aluno.perna_esquerda) if aluno.perna_esquerda else None,
        "perna_direita": float(aluno.perna_direita) if aluno.perna_direita else None,

        "panturrilha_esquerda": float(aluno.panturrilha_esquerda) if aluno.panturrilha_esquerda else None,
        "panturrilha_direita": float(aluno.panturrilha_direita) if aluno.panturrilha_direita else None,
    })




def buscar_alunos(request):
    alunos = Aluno.objects.all()

    data = []
    for aluno in alunos:
        # Verifica se o campo tem dados, separa por vírgula e remove espaços em branco
        if aluno.dias_disponiveis:
            lista_dias = [dia.strip() for dia in aluno.dias_disponiveis.split(',')]
        else:
            lista_dias = []

        data.append({
            "id": aluno.id,
            "nome": aluno.nome,
            "dias_disponiveis": lista_dias  # Agora retorna os dados reais do banco
        })

    return JsonResponse(data, safe=False)

# ============================================
# NOVAS FUNÇÕES PARA O MODAL GERENCIAR TREINO
# ============================================

@login_required
@treinador_required
def atribuir_treino(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    try:
        data = json.loads(request.body)
        treino_id = data.get('treino_id')
        aluno_id = data.get('aluno_id')
        dias = data.get('dias', [])

        if not treino_id or not aluno_id:
            return JsonResponse({'error': 'Dados incompletos'}, status=400)

        treino = get_object_or_404(Treino, id=treino_id)
        aluno = get_object_or_404(Aluno, id=aluno_id)

        # 1. Cria ou recupera o vínculo do aluno com este treino
        AlunoTreino.objects.update_or_create(
            aluno=aluno,
            treino=treino,
            defaults={'ativo': True}
        )

        # 2. Salva os dias de treino
        DiaTreinoAluno.objects.filter(aluno=aluno).delete()

        DIAS_MAP = {
            'Segunda': 'SEG', 'Terça': 'TER', 'Quarta': 'QUA',
            'Quinta': 'QUI', 'Sexta': 'SEX', 'Sábado': 'SAB', 'Domingo': 'DOM'
        }

        for dia_nome in dias:
            sigla = DIAS_MAP.get(dia_nome)
            if sigla:
                DiaTreinoAluno.objects.create(aluno=aluno, dia=sigla)

        return JsonResponse({'success': True})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
@treinador_required
def get_alunos_treino(request, treino_id):
    try:
        vinculos = AlunoTreino.objects.filter(treino_id=treino_id, ativo=True).select_related('aluno')
        lista = [{'id': v.aluno.id, 'nome': v.aluno.nome} for v in vinculos]
        return JsonResponse(lista, safe=False)
    except Exception:
        return JsonResponse([], safe=False)
    

@login_required
@treinador_required
def remover_aluno_treino(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Método não permitido'}, status=405)

    try:
        data = json.loads(request.body)
        treino_id = data.get('treino_id')
        aluno_id = data.get('aluno_id')

        # Remove o vínculo entre o aluno e o treino
        from .models import AlunoTreino
        AlunoTreino.objects.filter(treino_id=treino_id, aluno_id=aluno_id).delete()
        
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@login_required
@treinador_required
def desconectar_aluno(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            aluno_id = data.get('aluno_id')
            treinador = Treinador.objects.get(user=request.user)
            
            # Busca a conexão ativa entre este treinador e o aluno
            conexao = ConexaoAlunoTreinador.objects.filter(
                treinador=treinador, 
                aluno_id=aluno_id,
                status='ACEITA'
            ).first()

            if conexao:
                conexao.delete() # Ou conexao.status = 'ENCERRADA' se quiser manter histórico
                return JsonResponse({'success': True})
            
            return JsonResponse({'success': False, 'error': 'Conexão não encontrada.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Método inválido.'})