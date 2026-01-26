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

confirmCreateTraining.addEventListener('click', () => {
  console.log('CLIQUEI NO CRIAR TREINO'); // 👈 DEBUG

  const trainingName = document.getElementById('trainingName').value.trim();
  const selectedExercises = $('#exerciseSelect').val() || [];

  if (!trainingName || selectedExercises.length === 0) {
    alert('Preencha o nome e selecione exercícios');
    return;
  }

  const container = document.querySelector('.display-trainings');

  const card = document.createElement('div');
  card.className = 'training-card';

  card.innerHTML = `
    <div class="name-type">
      <p class="student-name">${trainingName}</p>
      <div class="badge active">Personalizado</div>
    </div>
    <div class="exercice-students">
      <p>${selectedExercises.length} exercícios</p>
      <p>Usado por 0 alunos</p>
    </div>
  `;

  container.prepend(card);

  // reset
  document.getElementById('trainingName').value = '';
  $('#exerciseSelect').selectpicker('deselectAll');

  document.getElementById('createPlanModal').classList.remove('active');
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






document.addEventListener('DOMContentLoaded', function () {
  if (window.jQuery && $('#exerciseSelect').length) {
    $('#exerciseSelect').selectpicker();
  }
});




document.addEventListener('DOMContentLoaded', () => {
  const selectAluno = document.getElementById('selectAluno');
  const daysSection = document.getElementById('daysSection');
  const daysGrid = document.getElementById('daysGrid');
  const exerciseConfig = document.getElementById('exerciseConfig');

  let selectedDay = null;

  // AO SELECIONAR ALUNO
  selectAluno.addEventListener('change', () => {
    daysGrid.innerHTML = '';
    exerciseConfig.style.display = 'none';
    selectedDay = null;

    if (!selectAluno.value) {
      daysSection.style.display = 'none';
      return;
    }

    const selectedOption = selectAluno.options[selectAluno.selectedIndex];
    const diasDisponiveis = selectedOption.dataset.dias;

    if (!diasDisponiveis) return;

    const dias = diasDisponiveis.split(',');

    daysSection.style.display = 'block';

    dias.forEach(dia => {
      const btn = document.createElement('button');
      btn.className = 'day-btn available';
      btn.textContent = dia.trim();

      btn.addEventListener('click', () => {
        document
          .querySelectorAll('.day-btn')
          .forEach(b => b.classList.remove('active'));

        btn.classList.add('active');
        selectedDay = dia.trim();

        exerciseConfig.style.display = 'block';
      });

      daysGrid.appendChild(btn);
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveTrainingManager')
    ?.addEventListener('click', () => {
      console.log('SALVANDO TREINO');
    });
});





  // ===============================
// MOCK DE ALUNOS (SIMULA BACKEND)
// ===============================
const mockAlunos = [
  {
    id: 1,
    nome: 'Ana Nunes',
    dias: ['Segunda', 'Quarta', 'Sexta'],
    avatar: 'A'
  },
  {
    id: 2,
    nome: 'João Silva',
    dias: ['Terça', 'Quinta'],
    avatar: 'J'
  },
  {
    id: 3,
    nome: 'Carlos Mendes',
    dias: ['Segunda', 'Terça', 'Quinta'],
    avatar: 'C'
  }
];




document.addEventListener('click', function (e) {
  const card = e.target.closest('.training-card');
  if (!card) return;

  const modal = document.getElementById('trainingManagerModal');
  if (!modal) return;

  console.log('CARD CLICADO — MODAL ABERTO');
  modal.classList.add('active');

  if (typeof carregarMock === 'function') {
    carregarMock();
  }
});

function carregarMock() {
  const selectAluno = document.getElementById('selectAluno');
  if (!selectAluno) return;

  // limpa antes (evita duplicar)
  selectAluno.innerHTML = '<option value="">Selecione um aluno</option>';

  mockAlunos.forEach(aluno => {
    const option = document.createElement('option');
    option.value = aluno.id;
    option.textContent = aluno.nome;
    option.dataset.dias = aluno.dias.join(',');

    selectAluno.appendChild(option);
  });
}







const selectAluno = document.getElementById('selectAluno');
const daysGrid = document.getElementById('daysGrid');
const daysSection = document.getElementById('daysSection');
const exerciseConfig = document.getElementById('exerciseConfig');

const ALL_DAYS = [
  { label: 'Segunda', value: 'segunda' },
  { label: 'Terça', value: 'terca' },
  { label: 'Quarta', value: 'quarta' },
  { label: 'Quinta', value: 'quinta' },
  { label: 'Sexta', value: 'sexta' },
  { label: 'Sábado', value: 'sabado' },
  { label: 'Domingo', value: 'domingo' }
];

selectAluno.addEventListener('change', () => {
  const option = selectAluno.selectedOptions[0];
  if (!option || !option.dataset.dias) return;

  // NORMALIZA OS DIAS VINDOS DO BACKEND
  const diasDisponiveis = option.dataset.dias
    .split(',')
    .map(d => d.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  daysGrid.innerHTML = '';
  daysSection.style.display = 'block';
  exerciseConfig.style.display = 'none';

  ALL_DAYS.forEach(day => {
    const btn = document.createElement('button');
    btn.textContent = day.label;
    btn.classList.add('day-btn');

    if (diasDisponiveis.includes(day.value)) {
      btn.classList.add('available');

      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        toggleInputs();
      });
    } else {
      btn.disabled = true;
      btn.style.opacity = '0.3';
      btn.style.cursor = 'not-allowed';
    }

    daysGrid.appendChild(btn);
  });
});

function toggleInputs() {
  const ativo = document.querySelector('.day-btn.active');
  exerciseConfig.style.display = ativo ? 'block' : 'none';
}
