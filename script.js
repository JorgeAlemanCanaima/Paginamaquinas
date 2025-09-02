document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const btnInicio = document.getElementById("btn-inicio");
  const selectUnidades = document.getElementById("select-temas");
  const btnMantenimiento = document.getElementById("btn-mantenimiento");
  const navbar = document.querySelector('.navbar');
  const statNumbers = document.querySelectorAll('.stat-number');
  const interactiveCards = document.querySelectorAll('.interactive-card');
  const learnMoreBtns = document.querySelectorAll('.learn-more-btn');

  // Función para animar contadores
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }
    
    updateCounter();
  }

  // Función para verificar si un elemento está en el viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Función para animar elementos cuando entran en el viewport
  function animateOnScroll() {
    const elements = document.querySelectorAll('.interactive-card, .timeline-item, .resource-card');
    
    elements.forEach(element => {
      if (isInViewport(element) && !element.classList.contains('animated')) {
        element.classList.add('animated');
        element.style.animation = 'fadeInUp 0.8s ease-out forwards';
      }
    });
  }

  // Función para manejar el scroll del navbar
  function handleNavbarScroll() {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(24, 26, 27, 0.98)';
      navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
      navbar.style.background = 'rgba(24, 26, 27, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  }

  // Función para mostrar tooltips en las cards
  function showCardTooltip(event, card) {
    const tooltip = document.createElement('div');
    tooltip.className = 'card-tooltip';
    tooltip.textContent = `Haz clic para aprender más sobre ${card.dataset.category}`;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = card.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    return tooltip;
  }

  // Función para ocultar tooltip
  function hideCardTooltip(tooltip) {
    if (tooltip) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 300);
    }
  }

  // Función para agregar efectos de partículas al botón de mantenimiento
  function createParticleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #a0ff00;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${centerX}px;
        top: ${centerY}px;
      `;
      
      document.body.appendChild(particle);
      
      const angle = (i / 8) * Math.PI * 2;
      const velocity = 100 + Math.random() * 50;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let opacity = 1;
      let scale = 1;
      
      function animateParticle() {
        const currentX = parseFloat(particle.style.left);
        const currentY = parseFloat(particle.style.top);
        
        particle.style.left = (currentX + vx * 0.016) + 'px';
        particle.style.top = (currentY + vy * 0.016) + 'px';
        
        opacity -= 0.02;
        scale -= 0.02;
        
        particle.style.opacity = opacity;
        particle.style.transform = `scale(${scale})`;
        
        if (opacity > 0 && scale > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      }
      
      requestAnimationFrame(animateParticle);
    }
  }

  // Función para agregar efectos de typing en el título
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  // Función para manejar la navegación suave
  function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Función para agregar efectos de parallax
  function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');
    
    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1);
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  // Event Listeners
  if (btnInicio) {
    btnInicio.addEventListener("click", function (event) {
      event.preventDefault();
      smoothScrollTo('.hero');
    });
  }

  if (selectUnidades) {
    selectUnidades.addEventListener("change", function () {
      const selectedPage = this.value;
      if (selectedPage) {
        // Agregar efecto de transición antes de cambiar de página
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
          window.location.href = selectedPage;
        }, 300);
      }
    });
  }

  if (btnMantenimiento) {
    btnMantenimiento.addEventListener("click", function (event) {
      event.preventDefault();
      createParticleEffect(event);
      
      // Agregar efecto de transición antes de cambiar de página
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      
      setTimeout(() => {
        window.location.href = "mantenimiento.html";
      }, 500);
    });
  }

  // Event listeners para las cards interactivas
  interactiveCards.forEach(card => {
    let tooltip = null;
    
    card.addEventListener('mouseenter', (event) => {
      tooltip = showCardTooltip(event, card);
    });
    
    card.addEventListener('mouseleave', () => {
      hideCardTooltip(tooltip);
    });
    
    card.addEventListener('click', () => {
      // Agregar efecto de ripple
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(102, 126, 234, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      card.style.position = 'relative';
      card.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Event listeners para los botones "Aprender Más"
  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Agregar efecto de pulso
      btn.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        btn.style.animation = '';
      }, 600);
      
      // Aquí puedes agregar lógica para mostrar más información
      const card = btn.closest('.interactive-card');
      const category = card.dataset.category;
      
      // Ejemplo: mostrar alerta con información adicional
      const info = {
        processing: 'El procesamiento incluye ALU, unidad de control, registros y caché.',
        memory: 'La memoria incluye RAM, ROM, caché L1/L2/L3 y memoria virtual.',
        io: 'Los dispositivos I/O incluyen USB, PCIe, SATA y conectores de red.'
      };
      
      if (info[category]) {
        showInfoModal(info[category], card.querySelector('.card-title').textContent);
      }
    });
  });

  // Función para mostrar modal de información
  function showInfoModal(content, title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        margin: 20px;
        position: relative;
        transform: scale(0.8);
        transition: transform 0.3s ease;
      ">
        <button onclick="this.closest('.modal').remove()" style="
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        ">&times;</button>
        <h3 style="color: #1d3557; margin-bottom: 20px;">${title}</h3>
        <p style="color: #666; line-height: 1.6;">${content}</p>
      </div>
    `;
    
    modal.classList.add('modal');
    document.body.appendChild(modal);
    
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);
  }

  // Event listeners para scroll
  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    animateOnScroll();
    handleParallax();
  });

  // Event listener para resize
  window.addEventListener('resize', () => {
    // Recalcular posiciones de elementos flotantes
    handleParallax();
  });

  // Inicialización de contadores cuando entran en el viewport
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target;
        const target = parseInt(statNumber.dataset.target);
        animateCounter(statNumber, target);
        statsObserver.unobserve(statNumber);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => {
    statsObserver.observe(stat);
  });

  // Agregar CSS para animaciones adicionales
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .card-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
    }
    
    .interactive-card.animated {
      opacity: 1;
      transform: translateY(0);
    }
    
    .interactive-card:not(.animated) {
      opacity: 0;
      transform: translateY(30px);
    }
  `;
  document.head.appendChild(style);

  // Inicializar efectos
  handleNavbarScroll();
  animateOnScroll();
  
  // Efecto de typing en el título principal (opcional)
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
  }

  // Agregar efecto de cursor parpadeante al título
  if (heroTitle) {
    heroTitle.style.borderRight = '3px solid #667eea';
    heroTitle.style.animation = 'blink 1s infinite';
    
    const blinkStyle = document.createElement('style');
    blinkStyle.textContent = `
      @keyframes blink {
        0%, 50% { border-color: transparent; }
        51%, 100% { border-color: #667eea; }
      }
    `;
    document.head.appendChild(blinkStyle);
  }

  console.log('🚀 Arquitectura de Máquinas - Página cargada con éxito!');
  console.log('✨ Funcionalidades interactivas activadas');
  console.log('📱 Diseño responsivo implementado');
  console.log('🎨 Efectos visuales y animaciones cargados');
});

