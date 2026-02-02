document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('btnConcluir');

  if (!btn) return;

  btn.addEventListener('click', function () {
    btn.classList.add('concluido');
    btn.innerText = 'Treino concluído';
    btn.disabled = true;
  });
});
