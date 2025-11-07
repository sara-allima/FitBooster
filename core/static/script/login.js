   document.addEventListener('DOMContentLoaded', () => {
      const passwordInput = document.getElementById('password');
      const toggleBtn = document.getElementById('togglePassword');

      const eyeOpen = '/static/imagens/fechar-o-olho.png';
      const eyeClosed = '/static/imagens/olho.png';
  
      const img = toggleBtn.querySelector('img');

      toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        // troca o ícone (tente trocar pelo URL externo)
        if (img) {
          img.src = isPassword ? eyeClosed : eyeOpen;
        }

        // acessibilidade
        toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
      });
    });