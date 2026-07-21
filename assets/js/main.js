(function () {
  const rootPrefix = document.body.dataset.root || '';
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    const message = link.dataset.message || 'Здравствуйте! Хочу подобрать кондиционер в Yuko Global.';
    link.href = `https://wa.me/998875010999?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });

  document.querySelectorAll('[data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const requestForm = document.querySelector('[data-request-form]');
  if (requestForm) {
    requestForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(requestForm);
      const name = data.get('name') || 'Клиент';
      const phone = data.get('phone') || 'не указан';
      const area = data.get('area') || 'не указана';
      const message = `Здравствуйте! Меня зовут ${name}. Нужен подбор кондиционера. Площадь: ${area} м². Телефон: ${phone}.`;
      window.open(`https://wa.me/998875010999?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  }

  const revealNodes = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  window.YUKO = {
    rootPrefix,
    productUrl(product) {
      return `${rootPrefix}products/${product.id}.html`;
    },
    imageUrl(product) {
      return `${rootPrefix}assets/images/${product.image}`;
    },
    escape(value) {
      const div = document.createElement('div');
      div.textContent = value;
      return div.innerHTML;
    }
  };
})();
