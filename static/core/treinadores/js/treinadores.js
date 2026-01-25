document.addEventListener("DOMContentLoaded", () => {
  const openPopup = document.getElementById("openPopup");
  const closePopup = document.getElementById("closePopup");
  const popupOverlay = document.getElementById("popupOverlay");
  const addTrainer = document.getElementById("addTrainer");
  const trainerList = document.getElementById("trainerList");
  const crefInput = document.getElementById("crefInput");
  const emptyMessage = document.getElementById("emptyMessage");

  const deleteOverlay = document.getElementById("deleteOverlay");
  const cancelDelete = document.getElementById("cancelDelete");
  const confirmDelete = document.getElementById("confirmDelete");

  let conexaoIdParaEncerrar = null;

  // 🔹 URLs vindas do Django
  const urlListar = trainerList.dataset.urlListar;
  const urlSolicitar = "/conexoes/solicitar/";
  const urlEncerrar = "/conexoes/encerrar/";

  function getCSRFToken() {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1];
  }

  function checkEmpty() {
    emptyMessage.style.display =
      trainerList.children.length === 0 ? "block" : "none";
  }

  // 🔹 Carregar conexões reais
  function carregarConexoes() {
    fetch(urlListar)
      .then(res => res.json())
      .then(data => {
        trainerList.innerHTML = "";

        data.forEach(conexao => {
          const card = document.createElement("div");
          card.className = "trainer-card";
          card.innerHTML = `
            <span>${conexao.nome} (${conexao.status})</span>
            <button class="delete-btn">✕</button>
          `;

          card.querySelector(".delete-btn").onclick = () => {
            conexaoIdParaEncerrar = conexao.id;
            deleteOverlay.style.display = "flex";
          };

          trainerList.appendChild(card);
        });

        checkEmpty();
      });
  }

  carregarConexoes();

  openPopup.onclick = () => popupOverlay.style.display = "flex";
  closePopup.onclick = () => popupOverlay.style.display = "none";

  addTrainer.onclick = () => {
    const cref = crefInput.value.trim();
    if (!cref) return;

    fetch(urlSolicitar, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify({ cref })
    })
      .then(res => res.json())
      .then(() => {
        crefInput.value = "";
        popupOverlay.style.display = "none";
        carregarConexoes();
      });
  };

  cancelDelete.onclick = () => {
    deleteOverlay.style.display = "none";
    conexaoIdParaEncerrar = null;
  };

  confirmDelete.onclick = () => {
    fetch(urlEncerrar, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken()
      },
      body: JSON.stringify({ id: conexaoIdParaEncerrar })
    })
      .then(() => {
        deleteOverlay.style.display = "none";
        conexaoIdParaEncerrar = null;
        carregarConexoes();
      });
  };
});
