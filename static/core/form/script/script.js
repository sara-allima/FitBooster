document.querySelector('form').addEventListener('submit', function (e) {
    const altura = parseFloat(document.getElementById('heightCm').value);
    const peso = parseFloat(document.getElementById('weight').value);

    if (altura > 3) {
        alert('Altura deve ser informada em metros. Ex: 1.75');
        e.preventDefault();
        return;
    }

    if (peso <= 0) {
        alert('Peso inválido');
        e.preventDefault();
    }
});