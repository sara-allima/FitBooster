
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
/* No topo do seu DOMContentLoaded ou escopo global do arquivo, 
   adicione esta variável para rastrear qual aluno está aberto no modal */
let alunoIdAtivo = null;

document.addEventListener('DOMContentLoaded', function () {

  // ... (mantenha seu código de barra de progresso e filtro)

  /* ===== MODAL RELATÓRIO ===== (ATUALIZADO) */
  const reportModal = document.getElementById('reportModal');
  const closeReportBtn = document.getElementById('closeModal');
  const modalStudentName = document.getElementById('modalStudentName');

  if (reportModal && closeReportBtn && modalStudentName) {
    document.querySelectorAll('.student-item').forEach(card => {
      const reportBtn = card.querySelectorAll('.action-btn')[1]; // Segundo botão é o de Relatório

      if (!reportBtn) return;

      reportBtn.addEventListener('click', () => {
        // CAPTURA O ID DO ALUNO DO CARD (Certifique-se que o HTML tem data-id="{{ aluno.id }}")
        alunoIdAtivo = card.dataset.id; 
        
        modalStudentName.textContent = card.dataset.name || '';
        reportModal.classList.add('active');
      });
    });
    // ... (mantenha os eventos de fechar o reportModal)
  }

  /* ===== MODAL DESCONECTAR ALUNO ===== (ATUALIZADO) */
  const disconnectModal = document.getElementById('disconnectModal');
  const confirmDisconnect = document.getElementById('confirmDisconnect');
  // ... (mantenha as outras variáveis de fechar)

/* ===== MODAL DESCONECTAR ALUNO ===== */
  if (confirmDisconnect) {
    confirmDisconnect.addEventListener('click', async () => {
      if (!alunoIdAtivo) return;

      try {
        const response = await fetch('/aluno/desconectar/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({ aluno_id: alunoIdAtivo })
        });

        const data = await response.json();

        if (data.success) {
          // 1. Fecha os modais primeiro
          disconnectModal.classList.remove('active');
          if (reportModal) reportModal.classList.remove('active');

          // 2. Encontra o card do aluno na lista e adiciona a animação
          const cardParaRemover = document.querySelector(`.student-item[data-id="${alunoIdAtivo}"]`);
          
          if (cardParaRemover) {
            cardParaRemover.classList.add('removing');
            
            // 3. Remove o elemento do HTML após o fim da animação (500ms)
            setTimeout(() => {
              cardParaRemover.remove();
              
              // Opcional: Se não sobrar nenhum aluno, mostra mensagem de lista vazia
              const lista = document.querySelector('.student-list');
              if (lista && lista.querySelectorAll('.student-item').length === 0) {
                lista.innerHTML = '<p class="empty-text" style="color: white; padding: 20px;">Você ainda não possui alunos vinculados.</p>';
              }
            }, 500);
          }
          
          alunoIdAtivo = null; // Limpa o ID
        } else {
          alert(data.error || 'Erro ao desconectar aluno');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro na comunicação com o servidor.');
      }
    });
  }

  // ... (resto do seu código de criar plano, gerenciar treino, etc)
});







document.addEventListener('DOMContentLoaded', function () {





  
  

  /* ===== BARRA DE PROGRESSO ===== */
  document.querySelectorAll('.progress-fill').forEach(el => {
    const val = el.dataset.progress || 0;
    setTimeout(() => {
      el.style.width = val + '%';
    }, 200);
  });

  /* ===== FILTRO DE PESQUISA ===== */
  const search = document.getElementById('search-students');
  if (search) {
    search.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();

      document.querySelectorAll('.student-item').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const goal = (card.dataset.goal || '').toLowerCase();

        card.style.display =
          name.includes(q) || goal.includes(q) || q === ''
            ? ''
            : 'none';
      });
    });
  }





const confirmCreateTraining = document.getElementById('confirmCreateTraining');
  if (confirmCreateTraining) {
    confirmCreateTraining.addEventListener('click', async () => {
    const nome = document.getElementById('trainingName').value.trim();
    const exerciciosSelecionados = $('#exerciseSelect').val(); // 👈 AQUI

    // 👉 USA A LISTA REAL (tags)
    if (!nome || !exerciciosSelecionados||exerciciosSelecionados.length === 0) {
      alert('Preencha tudo');
      return;
    }

    // monta exercícios a partir das tags
    const exercicios = exerciciosSelecionados.map(id => ({
      id: id,
      series: 3,
      repeticoes: 12,
      carga: 0
    }));

    console.log('Enviando:', exercicios);

    const response = await fetch('/treino/criar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken')
      },
      body: JSON.stringify({
        nome: nome,
        tipo: 'Personalizado',
        exercicios: exercicios
      })
    });

    const data = await response.json();

    if (data.success) {
    
      window.location.reload();
      document.getElementById('createPlanModal').classList.remove('active');

      $('#exerciseSelect').selectpicker('deselectAll');
  document.getElementById('trainingName').value = '';

      document.getElementById('trainingName').value = '';
    } else {
      alert(data.error || 'Erro ao criar treino');
    }
  });

}






function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}



fetch('/exercicios/')
  .then(res => res.json())
  .then(data => {
    const select = $('#exerciseSelect');
    select.empty();

    data.forEach(ex => {
      select.append(
        `<option value="${ex.id}">${ex.nome}</option>`
      );
    });

    select.selectpicker('refresh');
  });








  /* ===== MODAL RELATÓRIO ===== */
/* ===== LÓGICA UNIFICADA DO CARD DE ALUNO ===== */
/* ===== LÓGICA CORRIGIDA DOS BOTÕES DO CARD ===== */
document.addEventListener('click', function (e) {
    // 1. Identifica qual botão ou elemento foi clicado
    const reportBtn = e.target.closest('.btn-report');
    const planBtn = e.target.closest('.btn-plan');
    const closeBtn = e.target.closest('.btn-remove-row, #closeModal, #closeCreatePlan, #closeTrainingManager');
    const card = e.target.closest('.student-item');

    // Lógica para abrir Relatório
    if (reportBtn && card) {
        const reportModal = document.getElementById('reportModal');
        const modalStudentName = document.getElementById('modalStudentName');
        alunoIdAtivo = card.dataset.id;
        if (modalStudentName) modalStudentName.textContent = card.dataset.name;
        if (reportModal) reportModal.classList.add('active');
    }

    // Lógica para abrir Plano de Treino
    if (planBtn && card) {
        const trainingManagerModal = document.getElementById('trainingManagerModal');
        alunoIdAtivo = card.dataset.id;
        if (trainingManagerModal) {
            document.getElementById('trainingManagerTitle').textContent = `Plano de: ${card.dataset.name}`;
            trainingManagerModal.classList.add('active');
        }
    }

    // Lógica para o BOTÃO X (Fechar Modais)
    if (closeBtn) {
        // Encontra o modal pai do botão X clicado e remove a classe active
        const modal = closeBtn.closest('.modal, .modal-overlay'); 
        if (modal) {
            modal.classList.remove('active');
        } else {
            // Caso seja um botão de fechar genérico que não está dentro do modal no DOM
            document.querySelectorAll('.active').forEach(m => m.classList.remove('active'));
        }
    }
});
  /* ===== MODAL NOTIFICAÇÃO ===== */
  const btnNotificacao = document.getElementById('btnNotificacao');
  const notificacaoModal = document.getElementById('modalNotificacao');
  const fecharNotificacao = document.getElementById('fecharModal');

  if (btnNotificacao && notificacaoModal && fecharNotificacao) {
    btnNotificacao.addEventListener('click', () => {
      notificacaoModal.classList.add('active');
    });

    fecharNotificacao.addEventListener('click', () => {
      notificacaoModal.classList.remove('active');
    });

    notificacaoModal.addEventListener('click', (e) => {
      if (e.target === notificacaoModal) {
        notificacaoModal.classList.remove('active');
      }
    });
  }

  /* ===== MODAL DESCONECTAR ALUNO ===== */
  const openDisconnectBtn = document.getElementById('openDisconnectModal');
  const disconnectModal = document.getElementById('disconnectModal');
  const closeDisconnectBtn = document.getElementById('closeDisconnectModal');
  const cancelDisconnect = document.getElementById('cancelDisconnect');
  const confirmDisconnect = document.getElementById('confirmDisconnect');

  if (
    openDisconnectBtn &&
    disconnectModal &&
    closeDisconnectBtn &&
    cancelDisconnect &&
    confirmDisconnect
  ) {
    const closeDisconnect = () => {
      disconnectModal.classList.remove('active');
    };

    openDisconnectBtn.addEventListener('click', () => {
      disconnectModal.classList.add('active');
    });

    closeDisconnectBtn.addEventListener('click', closeDisconnect);
    cancelDisconnect.addEventListener('click', closeDisconnect);

    disconnectModal.addEventListener('click', (e) => {
      if (e.target === disconnectModal) {
        closeDisconnect();
      }
    });

    confirmDisconnect.addEventListener('click', () => {
      console.log('Aluno desconectado do treinador');
      closeDisconnect();
      if (reportModal) reportModal.classList.remove('active');
    });
  }

  /* ===== CRIAR PLANO ===== */
  const btnCreatePlan = document.querySelectorAll('.btn-create-plan');
  const createPlanModal = document.getElementById('createPlanModal');
  const closeCreatePlan = document.getElementById('closeCreatePlan');
  const cancelCreatePlan = document.getElementById('cancelCreatePlan');

  const selectStudent = document.getElementById('selectStudent');
  const availableDays = document.getElementById('availableDays');

  const exerciseModal = document.getElementById('exerciseModal');
  const closeExerciseModal = document.getElementById('closeExerciseModal');
  const confirmExercise = document.getElementById('confirmExercise');


  if (btnCreatePlan.length) {
    btnCreatePlan.forEach(btn => {
      btn.addEventListener('click', () => {
        createPlanModal.classList.add('active');
      });
    });
  }

  closeCreatePlan?.addEventListener('click', () => {
    createPlanModal.classList.remove('active');
  });

  cancelCreatePlan?.addEventListener('click', () => {
    createPlanModal.classList.remove('active');
  });

  

  closeExerciseModal?.addEventListener('click', () => {
    exerciseModal.classList.remove('active');
  });

  /* =====================================================
     TAGS DE EXERCÍCIOS (NOVA LÓGICA)
  ===================================================== */



  

});






function renderTrainingStudents(alunos) {
  const container = document.getElementById('trainingStudents');
  container.innerHTML = '';

  if (!alunos || alunos.length === 0) {
    container.innerHTML = '<p class="empty-text">Nenhum aluno atribuído a este treino</p>';
    return;
  }

  alunos.forEach(aluno => {
    const div = document.createElement('div');
    div.className = 'student-item';
    div.textContent = aluno.nome;
    container.appendChild(div);
  });
}



document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     MODAL GERENCIAR TREINO
  =============================== */
  const trainingManagerModal = document.getElementById('trainingManagerModal');
  const searchAluno = document.getElementById('searchAluno');
  const alunoResults = document.getElementById('alunoResults');
  const daysGrid = document.getElementById('daysGrid');
  const daysSection = document.getElementById('daysSection');
  const exerciseConfig = document.getElementById('exerciseConfig');
  let alunoSelecionado = null;
  let diasSelecionados = [];

function resetAlunoSelecionado() {
  alunoSelecionado = null;
  diasSelecionados = [];

  daysGrid.innerHTML = '';
  daysSection.style.display = 'none';
  exerciseConfig.style.display = 'none';
}

  if (!trainingManagerModal) return;

  /* ABRIR MODAL PELO CARD */
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.training-card');
    if (!card) return;

    const title = card.querySelector('.student-name')?.textContent || 'Treino';
    document.getElementById('trainingManagerTitle').textContent = title;

    trainingManagerModal.classList.add('active');
  });

  /* FECHAR MODAL */
  trainingManagerModal.addEventListener('click', (e) => {
    if (
      e.target === trainingManagerModal ||
      e.target.id === 'cancelTrainingManager' ||
      e.target.id === 'closeTrainingManager'
    ) {
      trainingManagerModal.classList.remove('active');
    }
  });

  /* ===============================
     BUSCA DE ALUNOS (AGORA FUNCIONA)
  =============================== */
  /* Substitua a parte de busca do Modal de Gerenciar Treino por esta única versão: */

if (searchInput) {
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim().toLowerCase();
        
        // Limpa os resultados anteriores imediatamente para evitar acúmulo visual
        resultsDiv.innerHTML = ''; 
        daysSection.style.display = 'none';
        selectedStudentId = null;

        if (query.length < 1) return;

        try {
            const res = await fetch('/alunos/buscar/');
            const alunos = await res.json();
            
            // Filtra localmente apenas para garantir a melhor experiência
            const filtrados = alunos.filter(a => a.nome.toLowerCase().includes(query));

            filtrados.forEach(aluno => {
                const div = document.createElement('div');
                div.className = 'search-item';
                div.textContent = aluno.nome;
                
                div.onclick = () => {
                    searchInput.value = aluno.nome;
                    resultsDiv.innerHTML = ''; // Limpa a lista após selecionar
                    selectedStudentId = aluno.id;
                    if(studentNameDisplay) studentNameDisplay.textContent = aluno.nome;
                    renderDaysForAssignment(aluno.dias_disponiveis || []);
                };
                resultsDiv.appendChild(div);
            });
        } catch (err) { 
            console.error("Erro ao buscar alunos:", err); 
        }
    });
}

  /* ===============================
     RENDERIZA DIAS
  =============================== */
  function renderDays(diasDisponiveis) {
    daysGrid.innerHTML = '';
    daysSection.style.display = 'block';
    exerciseConfig.style.display = 'none';

    

    const ALL_DAYS = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];

    ALL_DAYS.forEach(day => {
      const btn = document.createElement('button');
      btn.textContent = day;
      btn.className = 'day-btn';

      if (diasDisponiveis.includes(day)) {
        btn.classList.add('available');

        btn.addEventListener('click', () => {
        btn.classList.toggle('active');

        const dia = day;

        if (diasSelecionados.includes(dia)) {
          diasSelecionados = diasSelecionados.filter(d => d !== dia);
        } else {
          diasSelecionados.push(dia);
        }

        exerciseConfig.style.display = diasSelecionados.length ? 'block' : 'none';
      });
      } else {
        btn.disabled = true;
        btn.style.opacity = '0.3';
      }

      daysGrid.appendChild(btn);
    });
  }

});





document.addEventListener('DOMContentLoaded', function () {

    /* =============================================================
       LÓGICA DO MODAL "CRIAR TREINO" (ESTILO ADMIN INLINE)
    ============================================================= */
    
    let availableExercises = []; // Armazena os exercícios carregados do back-end
    const exerciseListContainer = document.getElementById('exerciseList');
    const btnAddRow = document.getElementById('btnAddExerciseRow');
    const confirmBtn = document.getElementById('confirmCreateTraining');

    // 1. Carregar lista de exercícios assim que a página abre
    fetch('/exercicios/')
        .then(res => res.json())
        .then(data => {
            availableExercises = data;
        })
        .catch(err => console.error("Erro ao buscar exercícios:", err));

    // 2. Função para criar uma nova linha de exercício
    function addExerciseRow() {
        if (!exerciseListContainer) return;

        const rowId = Date.now(); // ID único para a linha
        const row = document.createElement('div');
        row.className = 'exercise-row';
        row.dataset.rowId = rowId;

        // Monta as opções do Select
        let optionsHtml = '<option value="" disabled selected>Selecione...</option>';
        availableExercises.forEach(ex => {
            optionsHtml += `<option value="${ex.id}">${ex.nome}</option>`;
        });

        row.innerHTML = `
            <div class="field-col">
                <select class="exercise-select">
                    ${optionsHtml}
                </select>
            </div>
            <div class="field-col">
                <input type="number" class="exercise-series" value="" min="1">
            </div>
            <div class="field-col">
                <input type="number" class="exercise-reps" value="" min="1">
            </div>
            <div class="field-col">
                <input type="number" class="exercise-load" value="" min="0">
            </div>
            <div class="field-col" style="text-align: center;">
                <button type="button" class="btn-remove-row" title="Remover linha">
                    <i class="fa-solid fa-times"></i> &times;
                </button>
            </div>
        `;

        // Adiciona evento de remover ao botão X desta linha
        row.querySelector('.btn-remove-row').addEventListener('click', function() {
            row.remove();
        });

        exerciseListContainer.appendChild(row);
    }

    // 3. Evento do botão "+ Adicionar outro Exercício"
    if (btnAddRow) {
        btnAddRow.addEventListener('click', addExerciseRow);
    }

    // 4. Limpar o modal ao fechar (Opcional, mas recomendado)
    const modalCreate = document.getElementById('createPlanModal');
    const closeBtns = [
        document.getElementById('closeCreatePlan'), 
        document.getElementById('cancelCreatePlan')
    ];
    
    closeBtns.forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => {
                if(modalCreate) modalCreate.classList.remove('active');
                // Limpa os campos
                document.getElementById('trainingName').value = '';
                if(exerciseListContainer) exerciseListContainer.innerHTML = '';
            });
        }
    });

    // 5. ENVIAR O TREINO (Salvar)
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            const nameInput = document.getElementById('trainingName');
            const nomeTreino = nameInput.value.trim();

            if (!nomeTreino) {
                alert('Por favor, dê um nome ao treino.');
                return;
            }

            // Coletar dados das linhas
            const rows = document.querySelectorAll('.exercise-row');
            if (rows.length === 0) {
                alert('Adicione pelo menos um exercício ao treino.');
                return;
            }

            const exerciciosData = [];
            let error = false;

            rows.forEach(row => {
                const select = row.querySelector('.exercise-select');
                const series = row.querySelector('.exercise-series').value;
                const reps = row.querySelector('.exercise-reps').value;
                const load = row.querySelector('.exercise-load').value;

                if (!select.value) {
                    error = true; // Se tiver linha sem exercício selecionado
                }

                exerciciosData.push({
                    id: select.value,
                    series: parseInt(series),
                    repeticoes: parseInt(reps),
                    carga: parseInt(load)
                });
            });

            if (error) {
                alert('Selecione o exercício em todas as linhas ou remova as linhas vazias.');
                return;
            }

            // Enviar para o Back-end
            try {
                const response = await fetch('/treino/criar/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        nome: nomeTreino,
                        tipo: 'Personalizado',
                        exercicios: exerciciosData
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // Sucesso! Recarrega a página
                    window.location.reload();
                } else {
                    alert('Erro ao criar treino: ' + (data.error || 'Erro desconhecido'));
                }
            } catch (e) {
                console.error(e);
                alert('Erro na comunicação com o servidor.');
            }
        });
    }

    // Função auxiliar para pegar o CSRF Token (padrão Django)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});




/* ========================================================
   LÓGICA DO MODAL "GERENCIAR TREINO" (ATRIBUIR E LISTAR)
======================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const managerModal = document.getElementById('trainingManagerModal');
    const searchInput = document.getElementById('searchAluno');
    const resultsDiv = document.getElementById('alunoResults');
    const daysSection = document.getElementById('daysSection');
    const daysGrid = document.getElementById('daysGrid');
    const trainingIdInput = document.getElementById('currentTrainingId');
    const studentNameDisplay = document.getElementById('selectedStudentName');
    
    let selectedStudentId = null;
    let selectedDays = [];

    // 1. ABRIR O MODAL AO CLICAR NO CARD
    document.querySelectorAll('.training-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if(e.target.closest('button')) return;

            const treinoId = card.dataset.id;
            const treinoNome = card.querySelector('.student-name')?.textContent || 'Treino';
            
            // Preenche o título e o campo oculto
            document.getElementById('trainingManagerTitle').textContent = treinoNome;
            if(trainingIdInput) trainingIdInput.value = treinoId;

            // Limpa seleções anteriores de "Novo Aluno"
            if(searchInput) searchInput.value = '';
            if(resultsDiv) resultsDiv.innerHTML = '';
            if(daysSection) daysSection.style.display = 'none';
            selectedStudentId = null;
            selectedDays = [];

            // --- AQUI ESTAVA O SEU ERRO: AGORA CHAMAMOS A FUNÇÃO ---
            loadTrainingStudents(treinoId); 

            managerModal.classList.add('active');
        });
    });

    // 2. BUSCAR ALUNO (Autocomplete)
    if (searchInput) {
        searchInput.addEventListener('input', async () => {
            const query = searchInput.value.trim().toLowerCase();
            resultsDiv.innerHTML = '';
            daysSection.style.display = 'none';
            selectedStudentId = null;

            if (query.length < 1) return;

            try {
                const res = await fetch('/alunos/buscar/');
                const alunos = await res.json();
                const filtrados = alunos.filter(a => a.nome.toLowerCase().includes(query));

                filtrados.forEach(aluno => {
                    const div = document.createElement('div');
                    div.className = 'search-item';
                    div.textContent = aluno.nome;
                    div.addEventListener('click', () => {
                        searchInput.value = aluno.nome;
                        resultsDiv.innerHTML = '';
                        selectedStudentId = aluno.id;
                        if(studentNameDisplay) studentNameDisplay.textContent = aluno.nome;
                        renderDaysForAssignment(aluno.dias_disponiveis || []);
                    });
                    resultsDiv.appendChild(div);
                });
            } catch (err) { console.error("Erro ao buscar alunos:", err); }
        });
    }

    // 3. RENDERIZAR DIAS PARA ATRIBUIÇÃO
    function renderDaysForAssignment(diasDisponiveis) {
        daysGrid.innerHTML = '';
        daysSection.style.display = 'block';
        selectedDays = [];
        const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

        DIAS_SEMANA.forEach(dia => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = dia;
            btn.className = 'day-btn';

            if (diasDisponiveis.includes(dia)) {
                btn.classList.add('available');
                btn.addEventListener('click', () => {
                    btn.classList.toggle('active');
                    if (selectedDays.includes(dia)) {
                        selectedDays = selectedDays.filter(d => d !== dia);
                    } else {
                        selectedDays.push(dia);
                    }
                });
            } else {
                btn.disabled = true;
                btn.style.opacity = '0.3';
            }
            daysGrid.appendChild(btn);
        });
    }

    // 4. SALVAR ATRIBUIÇÃO
    const btnSaveManager = document.getElementById('saveTrainingManager');
    if (btnSaveManager) {
        btnSaveManager.addEventListener('click', async () => {
            const treinoId = trainingIdInput.value;
            if (!selectedStudentId || selectedDays.length === 0) {
                alert("Selecione um aluno e pelo menos um dia.");
                return;
            }

            try {
                const response = await fetch('/treino/atribuir/', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
                    body: JSON.stringify({ treino_id: treinoId, aluno_id: selectedStudentId, dias: selectedDays })
                });
                if ((await response.json()).success) {
                    // Em vez de recarregar a página toda, só atualiza a lista de alunos no modal
                    loadTrainingStudents(treinoId);
                    searchInput.value = '';
                    daysSection.style.display = 'none';
                    alert("Aluno adicionado!");
                }
            } catch (e) { alert("Erro ao salvar."); }
        });
    }
});

/* ========================================================
   FUNÇÕES GLOBAIS DE CARREGAMENTO E REMOÇÃO
======================================================== */
async function loadTrainingStudents(treinoId) {
    const container = document.getElementById('trainingStudents');
    if(!container) return;
    
    container.innerHTML = '<p class="empty-text">Carregando...</p>';

    try {
        const response = await fetch(`/treino/alunos/${treinoId}/`);
        const alunos = await response.json();

        container.innerHTML = ''; 

        if (alunos.length === 0) {
            container.innerHTML = '<p class="empty-text">Nenhum aluno vinculado.</p>';
            return;
        }

        alunos.forEach(aluno => {
            const box = document.createElement('div');
            box.className = 'student-assigned-box';
            box.innerHTML = `
                <span>${aluno.nome}</span>
                <button class="remove-student-btn" title="Remover aluno" onclick="handleRemoveStudent(${treinoId}, ${aluno.id}, this.parentElement)">&times;</button>
            `;
            container.appendChild(box);
        });
    } catch (error) {
        container.innerHTML = '<p class="empty-text">Erro ao carregar.</p>';
    }
}

async function handleRemoveStudent(treinoId, alunoId, element) {
    if(!confirm("Deseja remover este aluno do treino?")) return;

    try {
        const response = await fetch('/treino/remover-aluno/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') },
            body: JSON.stringify({ treino_id: treinoId, aluno_id: alunoId })
        });

        if ((await response.json()).success) {
            element.remove();
            if (document.getElementById('trainingStudents').children.length === 0) {
                document.getElementById('trainingStudents').innerHTML = '<p class="empty-text">Nenhum aluno vinculado.</p>';
            }
        }
    } catch (error) { alert("Erro ao remover."); }
}

// Abre/Fecha o popup de opções
function toggleOptionsMenu(event, trainingId) {
    event.stopPropagation(); // Impede de abrir o modal de gerenciar ao clicar nos pontos
    
    // Fecha outros popups abertos
    document.querySelectorAll('.training-options-popup').forEach(p => {
        if(p.id !== `popup-${trainingId}`) p.classList.remove('show');
    });

    const popup = document.getElementById(`popup-${trainingId}`);
    popup.classList.toggle('show');
}

// Fecha o popup se clicar fora dele
document.addEventListener('click', () => {
    document.querySelectorAll('.training-options-popup').forEach(p => p.classList.remove('show'));
});

// Deleta o treino do banco de dados
async function deleteTraining(trainingId) {
    if (!confirm("Tem certeza que deseja excluir este treino permanentemente? Ele sumirá para todos os alunos.")) return;

    try {
        const response = await fetch(`/treino/deletar/${trainingId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            // Remove o card da tela com animação
            const card = document.querySelector(`.training-card[data-id="${trainingId}"]`);
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => card.remove(), 300);
        } else {
            alert("Erro: " + data.error);
        }
    } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Ocorreu um erro ao tentar excluir o treino.");
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const btnPerfil = document.getElementById('btnPerfil');
    const modalPerfil = document.getElementById('modalPerfil');
    const fecharPerfil = document.getElementById('fecharPerfil');
    const inputFoto = document.getElementById('inputFoto');
    const previewFoto = document.getElementById('previewFoto');
    const previewPlaceholder = document.getElementById('previewPlaceholder');

    // Abrir Modal
    if (btnPerfil) {
        btnPerfil.addEventListener('click', () => {
            modalPerfil.classList.add('active');
        });
    }

    // Fechar Modal
    if (fecharPerfil) {
        fecharPerfil.addEventListener('click', () => {
            modalPerfil.classList.remove('active');
        });
    }

    // Preview da imagem antes de salvar
    if (inputFoto) {
        inputFoto.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (previewFoto) {
                        previewFoto.src = e.target.result;
                    } else if (previewPlaceholder) {
                        // Se não tinha foto, substitui o "+" pela imagem
                        const img = document.createElement('img');
                        img.id = 'previewFoto';
                        img.src = e.target.result;
                        previewPlaceholder.replaceWith(img);
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Modal Notificações
    const btnNoti = document.getElementById('btnNotificacao');
    const modalNoti = document.getElementById('modalNotificacao');
    const closeNoti = document.getElementById('fecharNotificacao');

    btnNoti?.addEventListener('click', () => modalNoti.classList.add('active'));
    closeNoti?.addEventListener('click', () => modalNoti.classList.remove('active'));

    // Modal Perfil
    const btnPerfil = document.getElementById('btnPerfil');
    const modalPerfil = document.getElementById('modalPerfil');
    const closePerfil = document.getElementById('fecharPerfil');

    btnPerfil?.addEventListener('click', () => modalPerfil.classList.add('active'));
    closePerfil?.addEventListener('click', () => modalPerfil.classList.remove('active'));

    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modalNoti) modalNoti.classList.remove('active');
        if (e.target === modalPerfil) modalPerfil.classList.remove('active');
    });
});



