const times = document.querySelectorAll('.time.editable');
const modal = document.getElementById('timeModal');
const hoursScroll = modal.querySelector('.hours');
const minutesScroll = modal.querySelector('.minutes');
const confirmBtn = document.getElementById('confirmTime');
let currentTimeElement = null;

const ITEM_HEIGHT = 40;
const SPACERS = 2;

// Criar lista
function fillScroll(container, max) {
  container.innerHTML = "";

  for (let i = 0; i < SPACERS; i++) container.appendChild(makeSpacer());

  for (let i = 0; i < max; i++) {
    const div = document.createElement("div");
    div.textContent = i.toString().padStart(2, "0");
    div.style.height = ITEM_HEIGHT + "px";
    container.appendChild(div);
  }

  for (let i = 0; i < SPACERS; i++) container.appendChild(makeSpacer());
}

function makeSpacer() {
  const div = document.createElement("div");
  div.textContent = "";
  div.style.height = ITEM_HEIGHT + "px";
  return div;
}

fillScroll(hoursScroll, 24);
fillScroll(minutesScroll, 60);

// Abrir modal
times.forEach(el => {
  el.addEventListener("click", () => {
    currentTimeElement = el;

    const [h, m] = el.textContent.split(":");
    hoursScroll.scrollTop = (parseInt(h) + SPACERS) * ITEM_HEIGHT;
    minutesScroll.scrollTop = (parseInt(m) + SPACERS) * ITEM_HEIGHT;

    modal.classList.remove("hidden");
  });
});

// Salvar
confirmBtn.addEventListener('click', () => {
  let h = Math.round(hoursScroll.scrollTop / ITEM_HEIGHT) - SPACERS;
  let m = Math.round(minutesScroll.scrollTop / ITEM_HEIGHT) - SPACERS;

  h = Math.max(0, Math.min(23, h));
  m = Math.max(0, Math.min(59, m));

  currentTimeElement.textContent = 
    `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;

  modal.classList.add('hidden');
});

// Fechar
document.querySelector(".close div").addEventListener("click", () => {
  modal.classList.add("hidden");
});