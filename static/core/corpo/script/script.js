// Alternar tabs
const tabPeso = document.getElementById("tabPeso");
const tabMedidas = document.getElementById("tabMedidas");

const boxPeso = document.getElementById("boxPeso");
const boxMedidas = document.getElementById("boxMedidas");

const btnpeso = document.getElementById("btnpeso");
const btnmedida = document.getElementById("btnmedida");

const hispeso = document.getElementById("hispeso");
const hismedida = document.getElementById("hismedida");

// Estado inicial
btnpeso.classList.remove("hidden");
btnmedida.classList.add("hidden");

hispeso.classList.remove("hidden");
hismedida.classList.add("hidden");

boxPeso.classList.remove("hidden");
boxMedidas.classList.add("hidden");

// ---- EVENTOS -----

tabPeso.onclick = () => {
    tabPeso.classList.add("ativo");
    tabMedidas.classList.remove("ativo");

    boxPeso.classList.remove("hidden");
    boxMedidas.classList.add("hidden");

    btnpeso.classList.remove("hidden");
    btnmedida.classList.add("hidden");

    hispeso.classList.remove("hidden");
    hismedida.classList.add("hidden");
};

tabMedidas.onclick = () => {
    tabMedidas.classList.add("ativo");
    tabPeso.classList.remove("ativo");

    boxMedidas.classList.remove("hidden");
    boxPeso.classList.add("hidden");

    btnmedida.classList.remove("hidden");
    btnpeso.classList.add("hidden");

    hispeso.classList.add("hidden");
    hismedida.classList.remove("hidden");
};

// Foto (não implementado ainda)
document.querySelector(".btn-add-foto").onclick = () => {
    alert("Função de adicionar foto ainda não criada!");
};
