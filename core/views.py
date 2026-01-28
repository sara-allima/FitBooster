from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required
from home.models import Aluno
from django.http import HttpResponse
from decimal import Decimal, InvalidOperation
from home.decorators import aluno_required
from home.models import Treinador, ConexaoAlunoTreinador, Treino, AlunoTreino, TreinoExercicio, ExercicioConcluido
from django.http import JsonResponse
from django.utils import timezone
import json
from django.shortcuts import get_object_or_404



def index(request):
    return render(request, 'core/index.html')


def form(request):
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        email = request.POST.get('email', '').strip()
        senha = request.POST.get('senha')
        confirmar_senha = request.POST.get('confirmar_senha')
        genero = request.POST.get('genero')
        objetivo = request.POST.get('objetivo')

        # 👇 NOVO: dias de treino vindos do front
        dias_disponiveis = request.POST.get('dias_treino', '').strip()

        # Conversões seguras
        try:
            idade = int(request.POST.get('idade'))
            peso = Decimal(request.POST.get('peso').replace(',', '.'))
            altura = Decimal(request.POST.get('altura').replace(',', '.'))
        except (TypeError, ValueError, InvalidOperation, AttributeError):
            return render(request, 'core/form.html', {
                'erro': 'Preencha corretamente idade, peso e altura.'
            })

        # Validação de senha
        if senha != confirmar_senha:
            return render(request, 'core/form.html', {
                'erro': 'Senhas não coincidem.'
            })

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=senha
            )

            Aluno.objects.create(
                user=user,
                nome=nome,
                email=email,
                genero=genero,
                idade=idade,
                peso=peso,
                altura=altura,
                objetivo=objetivo,
                dias_disponiveis=dias_disponiveis  # ✅ SALVO NO BANCO
            )

            return redirect('mobile-login')

        except IntegrityError:
            return render(request, 'core/form.html', {
                'erro': 'Email já cadastrado.'
            })

    return render(request, 'core/form.html')


@login_required(login_url='mobile-login')
@aluno_required
def home(request):
    aluno = request.user.aluno
    
    # Busca os 3 primeiros treinos ativos vinculados ao aluno
    aluno_treinos = (
        AlunoTreino.objects
        .filter(aluno=aluno, ativo=True)
        .select_related('treino')[:3]
    )
    
    # Extrai apenas os objetos de Treino da tabela intermediária
    treinos = [at.treino for at in aluno_treinos]
    
    context = {
        'treinos': treinos,
    }
    return render(request, 'core/home.html', context)


@login_required(login_url='mobile-login')
@aluno_required
def note(request):
    return render(request, 'core/note.html')


@login_required(login_url='mobile-login')
@aluno_required
def perfil(request):
    return render(request, 'core/perfil.html')


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')

        user = authenticate(request, username=email, password=senha)

        if user:
            auth_login(request, user)

            if Aluno.objects.filter(user=user).exists():
                return redirect('home')

        return render(request, 'core/login.html', {
            'erro': 'Email ou senha inválidos.'
        })

    return render(request, 'core/login.html')


@login_required(login_url='mobile-login')
@aluno_required
def registro(request):
    return render(request, 'core/registro.html')


@login_required(login_url='mobile-login')
@aluno_required
def clicar(request):
    return render(request, 'core/clicartreino.html')



@login_required(login_url='mobile-login')
@aluno_required
def corpo(request):
    aluno = request.user.aluno

    diferenca = None
    if aluno.meta_peso:
        diferenca = aluno.meta_peso - aluno.peso

    context = {
        'aluno': aluno,
        'diferenca': diferenca
    }

    return render(request, 'core/corpo.html', context)



@login_required(login_url='mobile-login')
@aluno_required
def escolher(request):
    return render(request, 'core/escolher.html')


@login_required(login_url='mobile-login')
@aluno_required
def reg(request):
    aluno = request.user.aluno

    if request.method == "POST":

        try:
            peso = request.POST.get("peso_atual")
            meta = request.POST.get("meta_peso")

            if peso:
                aluno.peso = Decimal(peso.replace(",", "."))

            if meta:
                aluno.meta_peso = Decimal(meta.replace(",", "."))

        except InvalidOperation:
            pass  # evita quebrar a página se vier algo inválido

        # MEDIDAS
        aluno.ombros = request.POST.get("ombros") or aluno.ombros
        aluno.peito = request.POST.get("peito") or aluno.peito
        aluno.antebraco_esquerdo = request.POST.get("antebraco_e") or aluno.antebraco_esquerdo
        aluno.antebraco_direito = request.POST.get("antebraco_d") or aluno.antebraco_direito
        aluno.braco_esquerdo = request.POST.get("braco_e") or aluno.braco_esquerdo
        aluno.braco_direito = request.POST.get("braco_d") or aluno.braco_direito
        aluno.cintura = request.POST.get("cintura") or aluno.cintura
        aluno.quadril = request.POST.get("quadril") or aluno.quadril
        aluno.perna_esquerda = request.POST.get("perna_e") or aluno.perna_esquerda
        aluno.perna_direita = request.POST.get("perna_d") or aluno.perna_direita
        aluno.panturrilha_esquerda = request.POST.get("panturrilha_e") or aluno.panturrilha_esquerda
        aluno.panturrilha_direita = request.POST.get("panturrilha_d") or aluno.panturrilha_direita

        aluno.save()
        return redirect("corpo")

    return render(request, 'core/reg.html', {
        "aluno": aluno
    })


@login_required(login_url='mobile-login')
@aluno_required
def tela(request):
    return render(request, 'core/tela.html')


def logout_view(request):
    logout(request)
    return redirect('mobile-login')


def list(request):
    return render(request, 'core/list.html')


@login_required(login_url='mobile-login')
@aluno_required
def treino(request):
    aluno = request.user.aluno

    # pega os vínculos ativos do aluno com treinos
    aluno_treinos = (
        AlunoTreino.objects
        .filter(aluno=aluno, ativo=True)
        .select_related('treino')
    )

    treinos_formatados = []

    for at in aluno_treinos:
        treino = at.treino

        qtd_exercicios = TreinoExercicio.objects.filter(
            treino=treino
        ).count()

        treinos_formatados.append({
            'id': treino.id,
            'nome': treino.nome,
            'descricao': treino.descricao,
            'data': treino.data_criacao,
            'qtd_exercicios': qtd_exercicios,
        })

    context = {
        'aluno': aluno,
        'treinos': treinos_formatados,
        'total_treinos': len(treinos_formatados),
    }

    return render(request, 'core/treino.html', context)


@login_required(login_url='mobile-login')
@aluno_required
def detalhe_treino(request, treino_id):
    aluno = request.user.aluno

    # garante que o treino pertence ao aluno
    treino = get_object_or_404(
        Treino,
        id=treino_id,
        alunos=aluno
    )

    exercicios = (
        TreinoExercicio.objects
        .filter(treino=treino)
        .select_related('exercicio')
    )

    context = {
        'treino': treino,
        'exercicios': exercicios
    }

    return render(request, 'core/detalhe_treino.html', context)

@login_required(login_url='mobile-login')
@aluno_required
def exercicio_detalhe(request, id):
    item = get_object_or_404(TreinoExercicio, id=id)

    concluido = False
    if request.user.is_authenticated:
        concluido = ExercicioConcluido.objects.filter(
            aluno=request.user.aluno,
            treino_exercicio=item
        ).exists()

    return render(
        request,
        'core/exercicio_detalhe.html',
        {
            'item': item,
            'concluido': concluido
        }
    )

@login_required(login_url='mobile-login')
@aluno_required
def concluir_exercicio(request, id):
    item = get_object_or_404(TreinoExercicio, id=id)
    aluno = request.user.aluno

    ExercicioConcluido.objects.get_or_create(
        aluno=aluno,
        treino_exercicio=item
    )

    return redirect('exercicio_detalhe', id=id)

@login_required(login_url='mobile-login')
@aluno_required
def treinoa(request):
    return render(request, 'core/treinoA.html')


@login_required(login_url='mobile-login')
@aluno_required
def calendario(request):
    return render(request, 'core/calendario.html')

@login_required(login_url='mobile-login')
@aluno_required
def atualizar_foto(request):
    if request.method == 'POST' and request.FILES.get('foto'):
        aluno = request.user.aluno
        aluno.foto = request.FILES['foto']
        aluno.save()
        return redirect('perfil')

    return JsonResponse({'erro': 'Imagem não enviada'}, status=400)

@login_required(login_url='mobile-login')
@aluno_required
def atualizar_nome(request):
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()

        if nome:
            aluno = request.user.aluno
            aluno.nome = nome
            aluno.save()
            return JsonResponse({'sucesso': True, 'nome': nome})

    return JsonResponse({'erro': 'Nome inválido'}, status=400)


@login_required(login_url='mobile-login')
@aluno_required
def treinadores(request):
    aluno = request.user.aluno

    conexoes_aceitas = ConexaoAlunoTreinador.objects.filter(
        aluno=aluno,
        status='ACEITA'
    ).select_related('treinador')

    return render(request, 'core/treinadores.html', {
        'conexoes': conexoes_aceitas,
    })



@login_required(login_url='mobile-login')
@aluno_required
def solicitar_treinador(request, cref):
    aluno = request.user.aluno
    treinador = get_object_or_404(Treinador, cref=cref)

    conexao, criada = ConexaoAlunoTreinador.objects.get_or_create(
        aluno=aluno,
        treinador=treinador,
        defaults={'status': 'PENDENTE'}
    )

    return redirect('treinadores')

@login_required(login_url='mobile-login')
@aluno_required
def treinadores_disponiveis(request):
    aluno = request.user.aluno

    # treinadores que já têm qualquer conexão com o aluno
    treinadores_com_conexao = ConexaoAlunoTreinador.objects.filter(
        aluno=aluno
    ).values_list('treinador_id', flat=True)

    # somente treinadores livres
    treinadores = Treinador.objects.exclude(
        cref__in=treinadores_com_conexao
    )

    data = []
    for t in treinadores:
        data.append({
            'nome': t.nome,
            'cref': t.cref
        })

    return JsonResponse(data, safe=False)


@login_required(login_url='mobile-login')
@aluno_required
def listar_conexoes(request):
    aluno = request.user.aluno

    conexoes = ConexaoAlunoTreinador.objects.filter(
        aluno=aluno,
        status__in=['PENDENTE', 'ACEITA']
    )

    data = []
    for c in conexoes:
        data.append({
            'id': c.id,
            'nome': c.treinador.nome,
            'cref': c.treinador.cref,
            'status': c.status
        })

    return JsonResponse(data, safe=False)

@login_required(login_url='mobile-login')
@aluno_required
def encerrar_conexao(request):
    if request.method != 'POST':
        return JsonResponse({'erro': 'Método inválido'}, status=400)

    body = json.loads(request.body)
    conexao_id = body.get('id')

    conexao = get_object_or_404(ConexaoAlunoTreinador, id=conexao_id)

    # segurança: só aluno ou treinador da conexão
    user = request.user
    if hasattr(user, 'aluno') and conexao.aluno == user.aluno:
        pass
    elif hasattr(user, 'treinador') and conexao.treinador == user.treinador:
        pass
    else:
        return JsonResponse({'erro': 'Sem permissão'}, status=403)

    conexao.status = 'ENCERRADA'
    conexao.data_encerramento = timezone.now()
    conexao.save()

    return JsonResponse({'sucesso': True})

@login_required(login_url='mobile-login')
@aluno_required
def corpo_dados(request):
    aluno = request.user.aluno

    data = {
        "peso": aluno.peso,
        "meta": aluno.meta_peso,
        "diferenca": (
            aluno.meta_peso - aluno.peso
            if aluno.meta_peso else None
        ),
        "medidas": {
            "ombros": aluno.ombros,
            "peito": aluno.peito,
            "antebraco_e": aluno.antebraco_esquerdo,
            "antebraco_d": aluno.antebraco_direito,
            "braco_e": aluno.braco_esquerdo,
            "braco_d": aluno.braco_direito,
            "cintura": aluno.cintura,
            "quadril": aluno.quadril,
            "perna_e": aluno.perna_esquerda,
            "perna_d": aluno.perna_direita,
            "pant_e": aluno.panturrilha_esquerda,
            "pant_d": aluno.panturrilha_direita,
        }
    }

    return JsonResponse(data)

@login_required(login_url='mobile-login')
@aluno_required
def salvar_peso(request):
    data = json.loads(request.body)
    aluno = request.user.aluno

    aluno.peso = Decimal(data["peso"])
    aluno.meta_peso = Decimal(data["meta"])
    aluno.save()

    return JsonResponse({"sucesso": True})

@login_required(login_url='mobile-login')
@aluno_required
def salvar_medidas(request):
    data = json.loads(request.body)
    aluno = request.user.aluno

    aluno.ombros = data["ombros"]
    aluno.peito = data["peito"]
    aluno.antebraco_esquerdo = data["antebraco_e"]
    aluno.antebraco_direito = data["antebraco_d"]
    aluno.braco_esquerdo = data["braco_e"]
    aluno.braco_direito = data["braco_d"]
    aluno.cintura = data["cintura"]
    aluno.quadril = data["quadril"]
    aluno.perna_esquerda = data["perna_e"]
    aluno.perna_direita = data["perna_d"]
    aluno.panturrilha_esquerda = data["pant_e"]
    aluno.panturrilha_direita = data["pant_d"]

    aluno.save()

    return JsonResponse({"sucesso": True})
