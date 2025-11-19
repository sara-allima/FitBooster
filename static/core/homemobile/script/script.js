const daysContainer = document.getElementById('daysContainer');
const monthLabel = document.getElementById('monthLabel');
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
let today = new Date();
let daysList = [];

function generateYearDays(year = new Date().getFullYear()) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  daysList = [];
  let d = new Date(start);
  while (d <= end) {
    daysList.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
}

function getDayStatus(dateObj) {
  const cmp = new Date(dateObj.toDateString()) - new Date(today.toDateString());
  if (cmp < 0) return (dateObj.getDate() % 2 === 0) ? 'done' : 'pending';
  else if (cmp === 0) return 'pending';
  else return 'none';
}

function renderDays() {
  daysContainer.innerHTML = '';
  daysList.forEach((d) => {
    const dayEl = document.createElement('div');
    dayEl.className = 'day ' + getDayStatus(d);
    const statusDiv = document.createElement('div');
    statusDiv.className = 'status';
    const number = document.createElement('strong');
    number.textContent = d.getDate();
    const wd = document.createElement('span');
    wd.textContent = weekDays[d.getDay()];
    dayEl.append(statusDiv, number, wd);
    if (d.toDateString() === today.toDateString()) dayEl.classList.add('active');
    daysContainer.appendChild(dayEl);
  });
}
generateYearDays();
renderDays();

// Treinos
const carousel = document.getElementById("carousel");
const addBtn = document.querySelector(".mais");
let trainings = [{ nome: "Nome do treino" }];

function renderTreinos() {
  const baseCard = carousel.querySelector(".create");
  carousel.querySelectorAll(".card:not(.create)").forEach(el => el.remove());

  trainings.forEach((t, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <p>${t.nome}</p>
      <div class="pontinhos">
        <img src="/static/core/img/3_pontinhos.png" alt="menu" class="menu-opcoes" data-index="${i}">
      </div>`;
    carousel.insertBefore(card, baseCard);
  });

  document.querySelectorAll(".menu-opcoes").forEach(menu => {
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
      fecharMenus();
      abrirMenuOpcoes(e.target, parseInt(menu.dataset.index));
    });
  });
  document.addEventListener("click", fecharMenus);
}

function abrirMenuOpcoes(el, index) {
  const menu = document.createElement("div");
  menu.className = "menu-popup";
  menu.innerHTML = `
    <button class="edit">Editar</button>
    <button class="duplicate">Duplicar</button>
    <button class="delete">Excluir</button>`;
  el.closest(".card").appendChild(menu);

  menu.querySelector(".edit").addEventListener("click", () => editarTreino(index));
  menu.querySelector(".duplicate").addEventListener("click", () => duplicarTreino(index));
  menu.querySelector(".delete").addEventListener("click", () => excluirTreino(index));
}

function fecharMenus() {
  document.querySelectorAll(".menu-popup").forEach(m => m.remove());
}

function editarTreino(index) {
  fecharMenus();
  showPopup(`
    <button class="close-btn">&times;</button>
    <h3>Editar treino</h3>
    <input type="text" id="editNome" value="${trainings[index].nome}">
    <button id="salvarEdicao">Salvar</button>
  `);
  document.getElementById("salvarEdicao").addEventListener("click", () => {
    const novoNome = document.getElementById("editNome").value.trim();
    if (!novoNome) return alert("Digite o nome!");
    trainings[index].nome = novoNome;
    renderTreinos();
    document.querySelector(".popup-overlay").remove();
  });
}

function duplicarTreino(index) {
  trainings.push({ nome: trainings[index].nome + " (cópia)" });
  renderTreinos();
  fecharMenus();
}

function excluirTreino(index) {
  if (!confirm("Deseja excluir este treino?")) return;
  trainings.splice(index, 1);
  renderTreinos();
  fecharMenus();
}

function showPopup(html) {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";
  overlay.innerHTML = `<div class="popup">${html}</div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector(".close-btn")?.addEventListener("click", () => overlay.remove());
}

addBtn.addEventListener("click", () => {
  showPopup(`
    <button class="close-btn">&times;</button>
    <h3>Criar rotina de treino</h3>
    <input type="text" id="nomeTreino" placeholder="Nome do treino">
    <textarea id="comentarios" placeholder="Comentários"></textarea>
    <button id="salvarTreino">Salvar</button>
  `);
  document.getElementById("salvarTreino").addEventListener("click", () => {
    const nome = document.getElementById("nomeTreino").value.trim();
    if (!nome) return alert("Digite o nome do treino!");
    trainings.push({ nome });
    renderTreinos();
    document.querySelector(".popup-overlay").remove();
  });
});

renderTreinos();

// Atualizar mês ao rolar
function updateMonthOnScroll() {
  const scrollLeft = daysContainer.scrollLeft;
  const dayWidth = 60;
  const index = Math.floor(scrollLeft / dayWidth);

  if (daysList[index]) {
    const currentMonth = months[daysList[index].getMonth()];
    monthLabel.textContent = currentMonth;
  }
}

daysContainer.addEventListener('scroll', updateMonthOnScroll);

// Começar semana atual
function getTodayIndex() {
  return daysList.findIndex(d => d.toDateString() === today.toDateString());
}

function getWeekStartIndex(todayIndex) {
  const currentDay = daysList[todayIndex];
  const weekDay = currentDay.getDay();
  return todayIndex - weekDay;
}

function scrollToCurrentWeek() {
  const todayIndex = getTodayIndex();
  if (todayIndex === -1) return;

  const startIndex = getWeekStartIndex(todayIndex);
  const dayWidth = 60;
  const scrollValue = startIndex * dayWidth;

  daysContainer.scrollLeft = scrollValue;
}

scrollToCurrentWeek();
