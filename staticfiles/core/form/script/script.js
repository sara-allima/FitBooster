// Seleção dos dias da semana
const dayButtons = document.querySelectorAll('#daysGrid button');
const diasInput = document.getElementById('dias_treino');

let diasSelecionados = [];

dayButtons.forEach(button => {
  button.addEventListener('click', () => {
    const dia = button.dataset.day;

    button.classList.toggle('active');

    if (diasSelecionados.includes(dia)) {
      diasSelecionados = diasSelecionados.filter(d => d !== dia);
    } else {
      diasSelecionados.push(dia);
    }

    diasInput.value = diasSelecionados.join(',');
  });
});

// Validação existente (mantida)
document.querySelector('form').addEventListener('submit', function (e) {
  const altura = parseFloat(document.getElementById('heightCm').value);
  const peso = parseFloat(document.getElementById('weight').value);

  if (altura > 3) {
    alert('Altura deve ser informada em metros. Ex: 1.75');
    e.preventDefault();
    return;
  }

  if (peso <= 0) {
    alert('Peso inválido');
    e.preventDefault();
  }
});
