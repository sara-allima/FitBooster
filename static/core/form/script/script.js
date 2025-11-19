// === Conversões ===
const cmToFeet = cm => Math.floor(cm / 30.48);
const cmToInches = cm => Math.round((cm / 2.54) % 12);
const feetToCm = (ft, inch) => (ft * 30.48 + inch * 2.54);
const kgToLbs = kg => +(kg * 2.20462).toFixed(1);
const lbsToKg = lbs => +(lbs / 2.20462).toFixed(1);

// === Seletores ===
const heightUnitBtns = document.querySelectorAll('#heightUnits button');
const weightUnitBtns = document.querySelectorAll('#weightUnits button');
const heightCmInput = document.getElementById('heightCm');
const heightFtInput = document.getElementById('heightFt');
const heightInInput = document.getElementById('heightIn');
const heightCmBox = document.getElementById('heightInputCm');
const heightFtBox = document.getElementById('heightInputFt');

const weightInput = document.getElementById('weight');
const bmiText = document.getElementById('bmiText');

const bodyCards = document.querySelectorAll('#bodyCards .card');
const dayButtons = document.querySelectorAll('#days button');
const recommendationText = document.getElementById('recommendation');

const nameInput = document.getElementById('name');
const genderInput = document.getElementById('gender');
const ageInput = document.getElementById('age');
const continueBtn = document.getElementById('continueBtn');

let heightUnit = 'cm';
let weightUnit = 'kg';

// === Função Ativo ===
function setActive(btns, activeBtn) {
  btns.forEach(b => b.classList.toggle('active', b === activeBtn));
}

// === UNIDADE ALTURA ===
heightUnitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.unit === heightUnit) return;

    if (btn.dataset.unit === 'cm') {
      const cm = feetToCm(+heightFtInput.value || 0, +heightInInput.value || 0);
      heightCmInput.value = Math.round(cm);
      heightCmBox.classList.remove('hidden');
      heightFtBox.classList.add('hidden');
      heightUnit = 'cm';
    } else {
      const cm = +heightCmInput.value || 0;
      heightFtInput.value = cmToFeet(cm);
      heightInInput.value = cmToInches(cm);
      heightCmBox.classList.add('hidden');
      heightFtBox.classList.remove('hidden');
      heightUnit = 'ft';
    }

    setActive(heightUnitBtns, btn);
    computeBMI();
    checkForm();
  });
});

// === UNIDADE PESO ===
weightUnitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.unit === weightUnit) return;

    if (!weightInput.value) {
      setActive(weightUnitBtns, btn);
      weightUnit = btn.dataset.unit;
      checkForm();
      return;
    }

    if (btn.dataset.unit === 'kg') {
      weightInput.value = lbsToKg(+weightInput.value);
      weightUnit = 'kg';
    } else {
      weightInput.value = kgToLbs(+weightInput.value);
      weightUnit = 'lbs';
    }

    setActive(weightUnitBtns, btn);
    computeBMI();
    checkForm();
  });
});

// === IMC ===
function computeBMI() {
  const weightKg = weightUnitBtns[0].classList.contains('active')
    ? +weightInput.value
    : lbsToKg(+weightInput.value);

  let heightM =
    heightUnitBtns[0].classList.contains('active')
      ? (+heightCmInput.value || 0) / 100
      : feetToCm(+heightFtInput.value || 0, +heightInInput.value || 0) / 100;

  if (!weightKg || !heightM) {
    bmiText.textContent = "Seu IMC aparecerá aqui.";
    return;
  }

  const bmi = +(weightKg / (heightM * heightM)).toFixed(1);

  let status =
    bmi < 18.5 ? "Abaixo do peso" :
    bmi < 25   ? "Saudável" :
    bmi < 30   ? "Sobrepeso" : "Obesidade";

  bmiText.innerHTML = `Seu IMC: <strong>${bmi}</strong> — ${status}.`;
}

[heightCmInput, heightFtInput, heightInInput, weightInput]
  .forEach(el => el.addEventListener("input", () => { computeBMI(); checkForm(); }));

[nameInput, genderInput, ageInput].forEach(el => el.addEventListener('input', checkForm));

// === OBJETIVO ===
bodyCards.forEach(card => {
  card.addEventListener('click', () => {
    bodyCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    checkForm();
  });
});

// === DIAS DE TREINO ===
dayButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');

    const selected = document.querySelectorAll("#days button.active").length;
    recommendationText.textContent =
      `Ótimo! Baseado em seus dados, recomendamos ${selected} treinos por semana.`;

    checkForm();
  });
});

// === VALIDAÇÃO SIMPLES PARA ATIVAR BOTÃO ===
function isHeightFilled() {
  if (heightUnit === 'cm') {
    return !!(+heightCmInput.value);
  } else {
    return !!(+heightFtInput.value) || !!(+heightInInput.value);
  }
}

function isFormComplete() {
  const nameOk = nameInput.value.trim().length > 0;
  const genderOk = genderInput.value.trim().length > 0;
  const ageOk = +ageInput.value > 0;
  const heightOk = isHeightFilled();
  const weightOk = +weightInput.value > 0;
  const goalOk = !!document.querySelector('#bodyCards .card.selected');
  const daysOk = document.querySelectorAll('#days button.active').length > 0;

  return nameOk && genderOk && ageOk && heightOk && weightOk && goalOk && daysOk;
}

function checkForm() {
  if (isFormComplete()) {
    continueBtn.classList.add('enabled');
    continueBtn.setAttribute('aria-disabled', 'false');
  } else {
    continueBtn.classList.remove('enabled');
    continueBtn.setAttribute('aria-disabled', 'true');
  }
}

// === AÇÃO DO BOTÃO (exemplo) ===
// === AÇÃO DO BOTÃO (navegar somente quando habilitado) ===
continueBtn.addEventListener('click', (e) => {
  // Se não estiver habilitado, não faz nada
  if (!continueBtn.classList.contains('enabled')) return;

  // Coleta dos dados (já tinha no seu código)
  const data = {
    name: nameInput.value.trim(),
    gender: genderInput.value.trim(),
    age: +ageInput.value,
    weight: +weightInput.value,
    heightUnit: heightUnit,
    heightCm: heightUnit === 'cm'
      ? +heightCmInput.value
      : feetToCm(+heightFtInput.value || 0, +heightInInput.value || 0),
    goal: document.querySelector('#bodyCards .card.selected').dataset.value,
    days: Array.from(document.querySelectorAll('#days button.active')).map(b => b.dataset.day)
  };
  console.log('dados prontos:', data);

  // Exemplo: enviar via fetch antes de navegar (opcional)
  // fetch('/salvar-dados/', { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type':'application/json'} })
  //   .then(res => res.ok ? window.location.href = continueBtn.dataset.href : alert('Erro ao salvar'))
  //   .catch(err => console.error(err));

  // Navega para a URL configurada no atributo data-href
  window.location.href = continueBtn.dataset.href;
});


// === INICIALIZAÇÃO ===
(function init() {
  heightCmInput.value = 175;
  weightInput.value = 72;
  computeBMI();
  checkForm();
})();
