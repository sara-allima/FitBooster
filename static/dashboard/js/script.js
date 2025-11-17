document.addEventListener('DOMContentLoaded', function(){
    // Deixa a página atual como "active" se baseando no nome do arquivo
    const path = location.pathname.split('/').pop(); // Procura o caminho do arquivo e pega ele
    const page = path === '' ? 'dashboard-alunos' : path;
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => {
        const href = t.getAttribute('href');
        if(!href) return;
        if(href.includes(page)) t.classList.add('active');
    });
    
    // Barrinha de progresso
    document.querySelectorAll('.progress-fill').forEach(el => {
        const val = el.dataset.progress || 0;
        // Delay
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
                if(name.includes(q) || goal.includes(q) || q==='') {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    document.querySelectorAll('.btn-primary').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      btn.animate([{transform:'scale(1)'},{transform:'scale(.98)'},{transform:'scale(1)'}],{
        duration:160, easing:'ease-out'
      });
    });
  });
});