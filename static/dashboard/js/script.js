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
});