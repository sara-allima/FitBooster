// Selecionar pop-ups
// const popupPhoto = document.getElementById("popupPhoto");
const popupName = document.getElementById("popupName");
const popupTheme = document.getElementById("popupTheme");

// Botões de abrir
// document.getElementById("photoBtn").onclick = () => popupPhoto.style.display = "flex";
document.getElementById("editNameBtn").onclick = () => popupName.style.display = "flex";
document.getElementById("themeBtn").onclick = () => popupTheme.style.display = "flex";

// Botões de fechar
// document.getElementById("closePhoto").onclick = () => popupPhoto.style.display = "none";
document.getElementById("closeNamePopup").onclick = () => popupName.style.display = "none";
document.getElementById("closeThemePopup").onclick = () => popupTheme.style.display = "none";

// Fechar ao clicar fora
window.onclick = (e) => {
  [popupName, popupTheme].forEach(popup => {
    if (e.target === popup) popup.style.display = "none";
  });
};

// 🟢 Alterar e salvar nome
const saveNameBtn = document.getElementById("saveNameBtn");
const nameInput = document.getElementById("nameInput");
const userName = document.getElementById("userName");

saveNameBtn.onclick = () => {
  const newName = nameInput.value.trim();

  if (!newName) {
    alert("Digite um nome válido");
    return;
  }

  fetch("/mobile/perfil/nome/", {
    method: "POST",
    headers: {
      "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `nome=${encodeURIComponent(newName)}`
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      userName.textContent = data.nome;
      popupName.style.display = "none";
      nameInput.value = "";
    }
  });

};


// 🔄 carregar nome salvo
// window.onload = () => {
//   const savedName = localStorage.getItem("userName");
//   if (savedName) userName.textContent = savedName;
// };
