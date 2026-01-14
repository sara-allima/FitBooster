// Seletores principais
const popupAdd = document.getElementById("popupAdd");
const btnAdd = document.getElementById("btnAdd");
const btnAddEmpty = document.getElementById("btnAddEmpty");
const closePopup = document.querySelector(".close-popup");
const popupMenu = document.getElementById("popupMenu");
const treinoList = document.getElementById("treinoList");
const emptyState = document.getElementById("emptyState");
const titleDias = document.getElementById("titleDias");

let treinoAtual = null;

// Abrir popup de adicionar
btnAdd.onclick = () => popupAdd.style.display = "flex";
btnAddEmpty.onclick = () => popupAdd.style.display = "flex";
closePopup.onclick = () => popupAdd.style.display = "none";

// Criar card de treino
function criarTreino(nome) {
  const card = document.createElement("div");
  card.classList.add("treino-card");

  card.innerHTML = `
    <div class="card-line">
      <h3>${nome}</h3>
      <img src="/static/core/img/3_pontinhos.png" class="menu-card open-menu">
    </div>
    <p class="sub-info">0 min · 0 exercício</p>
  `;

  // Evento dos 3 pontinhos
  card.querySelector(".open-menu").addEventListener("click", (e) => {
    treinoAtual = card;

    popupMenu.style.display = "block";
    popupMenu.style.top = (e.clientY + 5) + "px";
    popupMenu.style.left = (e.clientX - 110) + "px";

    e.stopPropagation();
  });

  return card;
}

// Atualizar visibilidade da lista / empty state
function atualizarEstadoLista() {
  const total = treinoList.children.length;

  if (total === 0) {
    emptyState.style.display = "block";
    titleDias.style.display = "none";
    treinoList.style.display = "none";
  } else {
    emptyState.style.display = "none";
    titleDias.style.display = "block";
    treinoList.style.display = "block";
  }
}

// Botão salvar treino
document.querySelector(".btn-salvar").onclick = () => {
  const nome = document.getElementById("nomeTreino").value || "Treino";

  treinoList.appendChild(criarTreino(nome));

  popupAdd.style.display = "none";

  atualizarEstadoLista();
};

// Clicar fora fecha menu
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("open-menu")) {
    popupMenu.style.display = "none";
  }
});

/* ===========================================
      FUNCIONALIDADES DO MENU
=========================================== */

// Excluir treino
document.getElementById("btnExcluir").onclick = () => {
  if (treinoAtual) {
    treinoAtual.remove();
    popupMenu.style.display = "none";

    atualizarEstadoLista();
  }
};

// Duplicar treino
document.getElementById("btnDuplicar").onclick = () => {
  if (treinoAtual) {
    const clone = treinoAtual.cloneNode(true);

    // Reativar evento dos 3 pontinhos no clone
    clone.querySelector(".open-menu").addEventListener("click", (e) => {
      treinoAtual = clone;

      popupMenu.style.display = "block";
      popupMenu.style.top = (e.clientY + 5) + "px";
      popupMenu.style.left = (e.clientX - 110) + "px";

      e.stopPropagation();
    });

    treinoList.appendChild(clone);
    popupMenu.style.display = "none";

    atualizarEstadoLista();
  }
};
