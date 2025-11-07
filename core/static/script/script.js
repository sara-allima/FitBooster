const images = document.querySelectorAll('.background-slider .bg');
const dots = document.querySelectorAll('.dot');
const textElement = document.querySelector('.text');

const frases = [
    "Registre facilmente os seus treinos, tudo num só lugar.",
    "Transforme o seu treino em progresso visível.",
    "Receba planos personalizados e aumente seu desempenho."
];

let current = 0;

function changeBackground() {
    images[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (current + 1) % images.length;

    images[current].classList.add('active');
    dots[current].classList.add('active');

    textElement.classList.add('fade');

    setTimeout(() => {
        textElement.textContent = frases[current];
        textElement.classList.remove('fade');
    }, 800);
}

setInterval(changeBackground, 5000);
