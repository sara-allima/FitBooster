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

  const daysMock = ['Segunda', 'Quarta', 'Sexta'];

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

  selectStudent?.addEventListener('change', () => {
    availableDays.innerHTML = '';
    if (!selectStudent.value) return;

    daysMock.forEach(day => {
      const btn = document.createElement('button');
      btn.className = 'day-btn';
      btn.textContent = day;

      btn.addEventListener('click', () => {
        exerciseModal.classList.add('active');
      });

      availableDays.appendChild(btn);
    });
  });

  closeExerciseModal?.addEventListener('click', () => {
    exerciseModal.classList.remove('active');
  });

  /* =====================================================
     TAGS DE EXERCÍCIOS (NOVA LÓGICA)
  ===================================================== */

  const exerciseList = [
    'Agachamento',
    'Supino',
    'Levantamento Terra',
    'Puxada',
    'Desenvolvimento',
    'Rosca Direta',
    'Rosca Alternada',
    'Tríceps Pulley',
    'Leg Press',
    'Cadeira Extensora'
  ];

  const exerciseSearch = document.getElementById('exerciseSearch');
  const exerciseOptions = document.getElementById('exerciseOptions');
  const selectedExercisesContainer = document.getElementById('selectedExercises');

  let selectedExercises = [];

  function renderOptions(filter = '') {
    exerciseOptions.innerHTML = '';

    exerciseList
      .filter(ex =>
        ex.toLowerCase().includes(filter.toLowerCase()) &&
        !selectedExercises.includes(ex)
      )
      .forEach(exercise => {
        const btn = document.createElement('div');
        btn.className = 'exercise-option';
        btn.textContent = exercise;

        btn.addEventListener('click', () => {
          selectedExercises.push(exercise);
          renderSelected();
          renderOptions(exerciseSearch.value);
        });

        exerciseOptions.appendChild(btn);
      });
  }

  function renderSelected() {
    selectedExercisesContainer.innerHTML = '';

    selectedExercises.forEach(exercise => {
      const tag = document.createElement('div');
      tag.className = 'exercise-tag';
      tag.innerHTML = `
        ${exercise}
        <button type="button">&times;</button>
      `;

      tag.querySelector('button').addEventListener('click', () => {
        selectedExercises = selectedExercises.filter(e => e !== exercise);
        renderSelected();
        renderOptions(exerciseSearch.value);
      });

      selectedExercisesContainer.appendChild(tag);
    });
  }

  if (exerciseSearch) {
    renderOptions();
    exerciseSearch.addEventListener('input', () => {
      renderOptions(exerciseSearch.value);
    });
  }

  /* ===== CONFIRMAR TREINO ===== */
  confirmExercise?.addEventListener('click', () => {
    const data = {
      aluno: selectStudent?.value,
      treino: document.getElementById('trainingName')?.value,
      exercicios: selectedExercises,
      series: document.getElementById('sets')?.value,
      repeticoes: document.getElementById('reps')?.value,
      descanso: document.getElementById('rest')?.value,
    };

    console.log('Treino criado:', data);

    exerciseModal.classList.remove('active');
    createPlanModal.classList.remove('active');

    selectedExercises = [];
    renderSelected();
    renderOptions();
  });

});


