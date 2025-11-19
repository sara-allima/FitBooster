const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// Abre menu
menuBtn.addEventListener("click", () => {
    sidebar.style.left = "0";
    overlay.style.display = "block";
});

// Fecha menu ao clicar no overlay
overlay.addEventListener("click", () => {
    sidebar.style.left = "-260px";
    overlay.style.display = "none";
});
