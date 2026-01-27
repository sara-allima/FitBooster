from django.contrib import admin
from .models import (
    Treinador,
    Aluno,
    Exercicio,
    Treino,
    TreinoExercicio,
    AlunoTreino,
    ConexaoAlunoTreinador,
    DiaTreinoAluno
)

# ============================
# INLINE MODELS
# ============================

class TreinoExercicioInline(admin.TabularInline):
    model = TreinoExercicio
    extra = 1


class AlunoTreinoInline(admin.TabularInline):
    model = AlunoTreino
    extra = 1


class DiaTreinoAlunoInline(admin.TabularInline):
    model = DiaTreinoAluno
    extra = 1


# ============================
# TREINO
# ============================

@admin.register(Treino)
class TreinoAdmin(admin.ModelAdmin):
    inlines = [TreinoExercicioInline, AlunoTreinoInline]

    list_display = (
        'nome',
        'tipo',
        'treinador',
        'data_criacao',
        'listar_alunos'
    )

    list_filter = ('tipo', 'data_criacao', 'treinador')
    search_fields = ('nome', 'descricao', 'treinador__nome')

    def listar_alunos(self, obj):
        return ", ".join(aluno.nome for aluno in obj.alunos.all())

    listar_alunos.short_description = 'Alunos'


# ============================
# ALUNO
# ============================

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    inlines = [DiaTreinoAlunoInline]

    list_display = (
        'nome',
        'email',
        'objetivo',
        'peso',
        'meta_peso',
        'altura',
        'idade'
    )

    list_filter = ('objetivo', 'genero')
    search_fields = ('nome', 'email', 'user__username')

    readonly_fields = ('user',)


# ============================
# TREINADOR
# ============================

@admin.register(Treinador)
class TreinadorAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'cref',
        'email',
        'formacao',
        'idade'
    )

    search_fields = ('nome', 'cref', 'email')
    readonly_fields = ('user',)


# ============================
# EXERCÍCIO
# ============================

@admin.register(Exercicio)
class ExercicioAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'grupo_muscular',
        'series',
        'repeticoes',
        'carga'
    )

    list_filter = ('grupo_muscular',)
    search_fields = ('nome', 'grupo_muscular')


# ============================
# TREINO x EXERCÍCIO
# ============================

@admin.register(TreinoExercicio)
class TreinoExercicioAdmin(admin.ModelAdmin):
    list_display = (
        'treino',
        'exercicio',
        'series',
        'repeticoes',
        'carga'
    )

    search_fields = (
        'treino__nome',
        'exercicio__nome'
    )


# ============================
# ALUNO x TREINO
# ============================

@admin.register(AlunoTreino)
class AlunoTreinoAdmin(admin.ModelAdmin):
    list_display = (
        'aluno',
        'treino',
        'ativo'
    )

    list_filter = ('ativo',)
    search_fields = (
        'aluno__nome',
        'treino__nome'
    )


# ============================
# CONEXÃO ALUNO ↔ TREINADOR
# ============================

@admin.register(ConexaoAlunoTreinador)
class ConexaoAlunoTreinadorAdmin(admin.ModelAdmin):
    list_display = (
        'aluno',
        'treinador',
        'status',
        'data_solicitacao',
        'data_resposta',
        'data_encerramento'
    )

    list_filter = ('status',)
    search_fields = (
        'aluno__nome',
        'treinador__nome',
        'treinador__cref'
    )


# ============================
# DIAS DE TREINO DO ALUNO
# ============================

@admin.register(DiaTreinoAluno)
class DiaTreinoAlunoAdmin(admin.ModelAdmin):
    list_display = (
        'aluno',
        'dia'
    )

    list_filter = ('dia',)
    search_fields = ('aluno__nome',)