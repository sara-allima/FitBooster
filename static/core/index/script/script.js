// elementos do DOM
const bgImages = document.querySelectorAll('.background-slider .bg'); // fundo (continua independente)
const cardImgs = document.querySelectorAll('.addimg .card-img');      // imagens do retângulo branco (DIFERENTES)
const dots = document.querySelectorAll('.dot');
const textElement = document.querySelector('.text');

const frases = [
    "Registre facilmente os seus treinos, tudo num só lugar.",
    "Transforme o seu treino em progresso visível.",
    "Receba exercícios do seu treinador e aumente o seu desempenho."
];

let current = 0;
let intervalId = null;
const intervalTime = 5000; // 5s

function updateUI(index) {
    // muda o fundo (mantendo seu slider de fundo)
    bgImages.forEach((img, i) => img.classList.toggle('active', i === index));

    // muda o retângulo (estas são IMAGENS DIFERENTES — cardImgs)
    cardImgs.forEach((ci, i) => ci.classList.toggle('active', i === index));

    // dots
    dots.forEach((d, i) => d.classList.toggle('active', i === index));

    // texto com fade
    textElement.classList.add('fade');
    setTimeout(() => {
        textElement.textContent = frases[index] || frases[0];
        textElement.classList.remove('fade');
    }, 300);
}

function nextSlide() {
    current = (current + 1) % Math.max(bgImages.length, cardImgs.length);
    // garante índice válido se quantidade for diferente: usa cardImgs se existirem, senão bgImages
    const limit = cardImgs.length || bgImages.length;
    current = current % limit;
    updateUI(current);
}

function goTo(index) {
    const limit = cardImgs.length || bgImages.length;
    current = index % limit;
    updateUI(current);
    restartInterval();
}

function restartInterval() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(nextSlide, intervalTime);
}

// adiciona clique nos dots
dots.forEach((dot, i) => {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', () => goTo(i));
});

// inicializa: se não houver imagens no cardImgs, o script ainda funciona com o bgImages
updateUI(current);
restartInterval();
