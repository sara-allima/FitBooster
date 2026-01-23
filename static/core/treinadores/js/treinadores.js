document.addEventListener("DOMContentLoaded", () => {
  const openPopup = document.getElementById("openPopup");
  const closePopup = document.getElementById("closePopup");
  const popupOverlay = document.getElementById("popupOverlay");
  const addTrainer = document.getElementById("addTrainer");
  const trainerList = document.getElementById("trainerList");
  const crefInput = document.getElementById("crefInput");
  const nameInput = document.getElementById("nameInput");
  const emptyMessage = document.getElementById("emptyMessage");

  const deleteOverlay = document.getElementById("deleteOverlay");
  const cancelDelete = document.getElementById("cancelDelete");
  const confirmDelete = document.getElementById("confirmDelete");

  let trainerToDelete = null;

  function checkEmpty() {
    emptyMessage.style.display =
      trainerList.children.length === 0 ? "block" : "none";
  }

  checkEmpty();

  openPopup.addEventListener("click", () => {
    popupOverlay.style.display = "flex";
  });

  closePopup.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) popupOverlay.style.display = "none";
  });

  addTrainer.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const cref = crefInput.value.trim();
    if (!name || !cref) return;

    const card = document.createElement("div");
    card.className = "trainer-card";
    card.innerHTML = `
      <span>${name} (CREF: ${cref})</span>
      <button class="delete-btn">✕</button>
    `;

    card.querySelector(".delete-btn").addEventListener("click", () => {
      trainerToDelete = card;
      deleteOverlay.style.display = "flex";
    });

    trainerList.appendChild(card);

    nameInput.value = "";
    crefInput.value = "";
    popupOverlay.style.display = "none";
    checkEmpty();
  });

  cancelDelete.addEventListener("click", () => {
    deleteOverlay.style.display = "none";
    trainerToDelete = null;
  });

  confirmDelete.addEventListener("click", () => {
    if (trainerToDelete) trainerToDelete.remove();
    deleteOverlay.style.display = "none";
    trainerToDelete = null;
    checkEmpty();
  });
});
