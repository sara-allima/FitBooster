 const items = document.querySelectorAll("li");

  items.forEach(li => {
    li.addEventListener("click", () => {
      
      // remover o botão dos outros itens
      items.forEach(x => x.classList.remove("active"));

      // adicionar no item clicado
      li.classList.add("active");
    });
  });