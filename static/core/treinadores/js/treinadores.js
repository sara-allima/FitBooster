document.addEventListener("DOMContentLoaded", () => {
  const openPopup = document.getElementById("openPopup");
  const closePopup = document.getElementById("closePopup");
  const popupOverlay = document.getElementById("popupOverlay");
  const trainerList = document.getElementById("trainerList");
  const emptyMessage = document.getElementById("emptyMessage");

  const deleteOverlay = document.getElementById("deleteOverlay");
  const cancelDelete = document.getElementById("cancelDelete");
  const confirmDelete = document.getElementById("confirmDelete");

  let conexaoIdParaEncerrar = null;

  // URLs
  const urlEncerrar = "/mobile/conexoes/encerrar/";
  const urlListar = "/mobile/conexoes/";
  const urlTreinadoresDisponiveis = "/mobile/treinadores/disponiveis/";

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

  function abrirConfirmacao(conexaoId) {
    conexaoIdParaEncerrar = conexaoId;
    deleteOverlay.style.display = "flex";
  }

  function carregarTreinadoresModal() {
    fetch(urlTreinadoresDisponiveis)
      .then(res => res.json())
      .then(data => {
        const lista = document.getElementById("listaTreinadoresModal");
        lista.innerHTML = "";

        if (data.length === 0) {
          lista.innerHTML =
            "<p style='color:#9ca3af'>Nenhum treinador disponível</p>";
          return;
        }

        data.forEach(t => {
          const div = document.createElement("div");
          div.className = "modal-card";

          div.innerHTML = `
            <div>
              <strong>${t.nome}</strong><br>
              <small>CREF: ${t.cref}</small>
            </div>
            <button>Adicionar</button>
          `;

          div.querySelector("button").onclick = () => {
            fetch(`/mobile/treinadores/solicitar/${t.cref}/`, {
              method: "POST",
              headers: {
                "X-CSRFToken": getCSRFToken()
              }
            }).then(() => {
              carregarTreinadoresModal();
              carregarConexoes();
            });
          };

          lista.appendChild(div);
        });
      });
  }

  function carregarConexoes() {
    fetch(urlListar)
      .then(res => res.json())
      .then(data => {
        trainerList.innerHTML = "";

        data
          .filter(c => c.status === "ACEITA")
          .forEach(conexao => {
            const card = document.createElement("div");
            card.className = "trainer-card";

            card.innerHTML = `
              <div>
                <strong>${conexao.nome}</strong><br>
                <small>CREF: ${conexao.cref}</small><br>
                <small>Status: Aceito</small>
              </div>
              <button class="delete-btn">✕</button>
            `;

            card.querySelector(".delete-btn").onclick = () => {
              abrirConfirmacao(conexao.id);
            };

            trainerList.appendChild(card);
          });

        checkEmpty();
      });
  }

  openPopup.onclick = () => {
    popupOverlay.style.display = "flex";
    carregarTreinadoresModal();
  };

  closePopup.onclick = () => {
    popupOverlay.style.display = "none";
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
    }).then(() => {
      deleteOverlay.style.display = "none";
      conexaoIdParaEncerrar = null;
      carregarConexoes();
    });
  };

  carregarConexoes();
});
