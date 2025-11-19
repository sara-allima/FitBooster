   document.addEventListener('DOMContentLoaded', () => {
      const passwordInput = document.getElementById('password');
      const toggleBtn = document.getElementById('togglePassword');

      const eyeOpen = '/static/core/login-registro/imagens/fechar-o-olho.png';
      const eyeClosed = '/static/core/login-registro/imagens/olho.png';
  
      const img = toggleBtn.querySelector('img');

      toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        
        if (img) {
          img.src = isPassword ? eyeClosed : eyeOpen;
        }

        // acessibilidade
        toggleBtn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
      });
    });