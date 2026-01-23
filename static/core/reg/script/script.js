const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ACCORDION */
$$('.acc-row').forEach(row => {
  row.addEventListener('click', () => {
    const target = row.dataset.target;
    const box = document.getElementById('body-' + target);

    $$('.acc-body').forEach(b => {
      if (b !== box) b.classList.remove('active');
    });

    box.classList.toggle('active');
  });
});

/* SAVE */
$("#saveBtn").addEventListener("click", () => {
  $("#saveBtn").textContent = "Salvo";
  setTimeout(() => $("#saveBtn").textContent = "Salvar", 1500);
});
