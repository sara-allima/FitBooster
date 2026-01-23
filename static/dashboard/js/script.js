document.addEventListener('DOMContentLoaded', function(){    

  // Barrinha de progresso
  document.querySelectorAll('.progress-fill').forEach(el => {
    const val = el.dataset.progress || 0;
    setTimeout(()=> el.style.width = val + '%', 200);
  });

  // Filtro de pesquisa
  const search = document.getElementById('search-students');
  if(search){
    search.addEventListener('input', function(){
      const q = this.value.trim().toLowerCase();
      document.querySelectorAll('.student-item').forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const goal = card.dataset.goal.toLowerCase();
        card.style.display =
          name.includes(q) || goal.includes(q) || q === ''
            ? ''
            : 'none';
      });
    });
  }

  /* ===== MODAL RELATÓRIO ===== */
  const modal = document.getElementById('reportModal');
  const closeBtn = document.getElementById('closeModal');
  const modalStudentName = document.getElementById('modalStudentName');

  document.querySelectorAll('.student-item').forEach(card => {
    const reportBtn = card.querySelectorAll('.action-btn')[1];

    reportBtn.addEventListener('click', () => {
      modalStudentName.textContent = card.dataset.name;
      modal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if(e.target === modal){
      modal.classList.remove('active');
    }
  });
});
