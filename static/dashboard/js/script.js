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
if (!confirmCreateTraining) return;



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



  

});






document.addEventListener('DOMContentLoaded', function () {
  if (window.jQuery && $('#exerciseSelect').length) {
    $('#exerciseSelect').selectpicker();
  }
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
if(selectAluno) {
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
}
function toggleInputs() {
  const ativo = document.querySelector('.day-btn.active');
  exerciseConfig.style.display = ativo ? 'block' : 'none';
}





/* =====================================================
   MODAL GERENCIAR TREINO (ABRIR / FECHAR)
===================================================== */

/* =====================================================
   MODAL GERENCIAR TREINO (ABRIR / FECHAR) - CORRIGIDO
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const trainingManagerModal = document.getElementById('trainingManagerModal');
  if (!trainingManagerModal) return;

  // Delegação de Evento: Escuta cliques no container, mas só age se for num .training-card
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.training-card');
    if (card) {
      // Opcional: Pegar o nome do treino do card e colocar no título do modal
      const trainingName = card.querySelector('.student-name').textContent;
      document.getElementById('trainingManagerTitle').textContent = trainingName;
      
      trainingManagerModal.classList.add('active');
    }
  });

  // Fechar Modal
  const closeElements = [
    trainingManagerModal.querySelector('.modal-close'),
    document.getElementById('cancelTrainingManager'),
    trainingManagerModal // Clique no overlay
  ];

  closeElements.forEach(el => {
    el?.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('modal-close') || el.id === 'cancelTrainingManager') {
        trainingManagerModal.classList.remove('active');
      }
    });
  });
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


const searchAluno = document.getElementById('searchAluno');
const alunoResults = document.getElementById('alunoResults');

searchAluno.addEventListener('input', () => {
  const q = searchAluno.value.toLowerCase().trim();
  alunoResults.innerHTML = '';

  if (!q) return;

  mockAlunos
    .filter(a => a.nome.toLowerCase().includes(q))
    .forEach(aluno => {
      const div = document.createElement('div');
      div.className = 'search-item';
      div.textContent = aluno.nome;

      div.addEventListener('click', () => {
        searchAluno.value = aluno.nome;
        alunoResults.innerHTML = '';
        renderDays(aluno.dias);
      });

      alunoResults.appendChild(div);
    });
});



function renderDays(diasDisponiveis) {
  const daysGrid = document.getElementById('daysGrid');
  const daysSection = document.getElementById('daysSection');

  daysGrid.innerHTML = '';
  daysSection.style.display = 'block';
  exerciseConfig.style.display = 'none';

  ALL_DAYS.forEach(day => {
    const btn = document.createElement('button');
    btn.textContent = day.label;
    btn.className = 'day-btn';

    if (diasDisponiveis.map(d => d.toLowerCase()).includes(day.label.toLowerCase())) {
      btn.classList.add('available');

      btn.addEventListener('click', () => {
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        exerciseConfig.style.display = 'block';
      });
    } else {
      btn.disabled = true;
      btn.style.opacity = '0.3';
    }

    daysGrid.appendChild(btn);
  });
}
