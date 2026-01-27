from django.contrib import admin
from .models import *

# Register your models here.
class TreinoExercicioInline(admin.TabularInline):
    model = TreinoExercicio
    extra = 1

class TreinoAdmin(admin.ModelAdmin):
    inlines = [TreinoExercicioInline]
    list_display = (
        'nome',
        'treinador',
        'tipo',
        'data_criacao',
        'listar_alunos'
    )
    list_filter = ('tipo', 'data_criacao')
    search_fields = ('nome', 'treinador__nome')

    def listar_alunos(self, obj):
        return ", ".join(
            aluno.nome for aluno in obj.alunos.all()
        )

    listar_alunos.short_description = 'Alunos'

admin.site.register(Treino, TreinoAdmin)

class AlunoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'email', 'objetivo', 'peso', 'altura', 'idade')
    search_fields = ('nome', 'email')
    list_filter = ('objetivo',)

admin.site.register(Aluno, AlunoAdmin)

class TreinadorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cref', 'formacao', 'idade')
    search_fields = ('nome', 'cref')

admin.site.register(Treinador, TreinadorAdmin)

class ExercicioAdmin(admin.ModelAdmin):
    list_display = ('nome', 'grupo_muscular')
    search_fields = ('nome', 'grupo_muscular')
    list_filter = ('grupo_muscular',)

admin.site.register(Exercicio, ExercicioAdmin)


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

admin.site.register(ConexaoAlunoTreinador, ConexaoAlunoTreinadorAdmin)
