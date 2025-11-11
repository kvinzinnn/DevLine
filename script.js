// Classe para representar uma partícula
class Particle {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * 5 + 2;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.originalVx = this.vx;
    this.originalVy = this.vy;
  }

  update(mouseX, mouseY) {
    // Movimento magnético para o mouse
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      this.vx += dx * 0.01;
      this.vy += dy * 0.01;
    } else {
      // Voltar à velocidade original gradualmente
      this.vx += (this.originalVx - this.vx) * 0.01;
      this.vy += (this.originalVy - this.vy) * 0.01;
    }

    // Atualizar posição
    this.x += this.vx;
    this.y += this.vy;

    // Bordas: wrap around
    if (this.x < 0) this.x = window.innerWidth;
    if (this.x > window.innerWidth) this.x = 0;
    if (this.y < 0) this.y = window.innerHeight;
    if (this.y > window.innerHeight) this.y = 0;
  }
}

// Classe principal da aplicação
class App {
  constructor() {
    this.welcomeText = '';
    this.welcomeFullText = 'Bem-vindo ao Futuro';
    this.digitalText = '';
    this.digitalFullText = 'Digital';
    this.welcomeIndex = 0;
    this.digitalIndex = 0;
    this.particles = [];
    this.animationFrameId = null;
    this.mouseX = 0;
    this.mouseY = 0;

    this.init();
  }

  init() {
    this.generateParticles();
    this.animateParticles();
    this.addEventListeners();
    this.startTyping();
  }

  startTyping() {
    this.typeWelcome();
  }

  typeWelcome() {
    if (this.welcomeIndex < this.welcomeFullText.length) {
      this.welcomeText += this.welcomeFullText.charAt(this.welcomeIndex);
      this.welcomeIndex++;
      document.getElementById('welcome-text').textContent = this.welcomeText;
      setTimeout(() => this.typeWelcome(), 50); // Mais rápido
    } else {
      // Remover cursor de "Bem-vindo ao Futuro" e adicionar a "Digital"
      document.getElementById('welcome-text').classList.remove('typing');
      document.getElementById('digital-text').classList.add('typing');
      // Após completar "Bem-vindo ao Futuro", iniciar "Digital"
      setTimeout(() => this.typeDigital(), 200);
    }
  }

  typeDigital() {
    if (this.digitalIndex < this.digitalFullText.length) {
      this.digitalText += this.digitalFullText.charAt(this.digitalIndex);
      this.digitalIndex++;
      document.getElementById('digital-text').textContent = this.digitalText;
      setTimeout(() => this.typeDigital(), 50); // Mais rápido
    }
    // Cursor permanece piscando após completar
  }

  generateParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle());
    }
    this.renderParticles();
  }

  renderParticles() {
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';
    this.particles.forEach((particle, index) => {
      const particleElement = document.createElement('div');
      particleElement.className = 'particle';
      particleElement.style.left = particle.x + 'px';
      particleElement.style.top = particle.y + 'px';
      particleElement.style.width = particle.size + 'px';
      particleElement.style.height = particle.size + 'px';
      particlesContainer.appendChild(particleElement);
    });
  }

  animateParticles() {
    this.animationFrameId = requestAnimationFrame(() => {
      this.particles.forEach(particle => {
        particle.update(this.mouseX, this.mouseY);
      });
      this.renderParticles();
      this.animateParticles();
    });
  }

  addEventListeners() {
    document.getElementById('particles').addEventListener('mousemove', (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });

    document.getElementById('tech-button').addEventListener('click', () => {
      alert('Funcionalidade demo!');
    });

    // Animações de scroll
    this.addScrollAnimations();
  }

  addScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    // Pausar animações inicialmente
    const sections = document.querySelectorAll('.services, .about, .contact');
    sections.forEach(section => {
      section.style.animationPlayState = 'paused';
      observer.observe(section);
    });
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  // Limpar recursos quando a página for descarregada
  window.addEventListener('beforeunload', () => {
    app.destroy();
  });
});
