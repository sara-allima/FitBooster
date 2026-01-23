// Selecionar pop-ups
const popupPhoto = document.getElementById("popupPhoto");
const popupName = document.getElementById("popupName");
const popupTheme = document.getElementById("popupTheme");

// Botões de abrir
document.getElementById("photoBtn").onclick = () => popupPhoto.style.display = "flex";
document.getElementById("editNameBtn").onclick = () => popupName.style.display = "flex";
document.getElementById("themeBtn").onclick = () => popupTheme.style.display = "flex";

// Botões de fechar
document.getElementById("closePhoto").onclick = () => popupPhoto.style.display = "none";
document.getElementById("closeNamePopup").onclick = () => popupName.style.display = "none";
document.getElementById("closeThemePopup").onclick = () => popupTheme.style.display = "none";

// Fechar ao clicar fora
window.onclick = (e) => {
  [popupPhoto, popupName, popupTheme].forEach(popup => {
    if (e.target === popup) popup.style.display = "none";
  });
};

// 🟢 Alterar e salvar nome
const saveNameBtn = document.getElementById("saveNameBtn");
const nameInput = document.getElementById("nameInput");
const userName = document.getElementById("userName");

saveNameBtn.onclick = () => {
  const newName = nameInput.value.trim();

  if (newName !== "") {
    userName.textContent = newName;
    popupName.style.display = "none";
    localStorage.setItem("userName", newName);
    nameInput.value = "";
  } else {
    alert("Por favor, digite um nome válido!");
  }
};

// 🔄 carregar nome salvo
window.onload = () => {
  const savedName = localStorage.getItem("userName");
  if (savedName) userName.textContent = savedName;
};
