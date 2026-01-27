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
  const reportModal = document.getElementById('reportModal');
  const closeReportBtn = document.getElementById('closeModal');
  const modalStudentName = document.getElementById('modalStudentName');

  if (reportModal && closeReportBtn && modalStudentName) {
    document.querySelectorAll('.student-item').forEach(card => {
      const buttons = card.querySelectorAll('.action-btn');
      const reportBtn = buttons[1];

      if (!reportBtn) return;

      reportBtn.addEventListener('click', () => {
        modalStudentName.textContent = card.dataset.name || '';
        reportModal.classList.add('active');
      });
    });

    closeReportBtn.addEventListener('click', () => {
      reportModal.classList.remove('active');
    });

    reportModal.addEventListener('click', (e) => {
      if (e.target === reportModal) {
        reportModal.classList.remove('active');
      }
    });
  }

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
  if (searchAluno) {
    searchAluno.addEventListener('input', async () => {
      resetAlunoSelecionado();

      const q = searchAluno.value.trim().toLowerCase();
      alunoResults.innerHTML = '';

      if (q.length < 1) return;

      const res = await fetch('/alunos/buscar/');
      const alunos = await res.json();

      alunos
        .filter(a => a.nome.toLowerCase().includes(q))
        .forEach(aluno => {
          const div = document.createElement('div');
          div.className = 'search-item';
          div.textContent = aluno.nome;

         div.addEventListener('click', () => {
           resetAlunoSelecionado();

            alunoSelecionado = aluno;

            // RESET TOTAL
            diasSelecionados = [];
            daysGrid.innerHTML = '';
            exerciseConfig.style.display = 'none';

            searchAluno.value = aluno.nome;
            alunoResults.innerHTML = '';

            renderDays(aluno.dias_disponiveis || []);
          });




          alunoResults.appendChild(div);
        });
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



