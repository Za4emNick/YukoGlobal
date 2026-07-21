(function () {
  const root = document.querySelector('[data-product-root]');
  const id = document.body.dataset.productId;
  if (!root || !id || !window.YUKO_PRODUCTS) return;

  const product = window.YUKO_PRODUCTS.find((item) => item.id === id);
  if (!product) {
    root.innerHTML = '<div class="empty-state"><h1>Товар не найден</h1><a class="button button--light" href="../catalog.html">Вернуться в каталог</a></div>';
    return;
  }

  document.title = `${product.title} — Yuko Global`;
  const pageDescription = `${product.title}: ${product.cooling} на охлаждение, площадь до ${product.area} м². Продажа и подбор в Самарканде.`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', pageDescription);

  const specs = [
    ['Модель', product.model],
    ['Рекомендуемая площадь', `до ${product.area} м²`],
    ['Мощность охлаждения', product.cooling],
    ['Мощность обогрева', product.heating],
    ['Потребление при охлаждении', product.powerCooling],
    ['Класс энергоэффективности', product.energy],
    ['SEER / SCOP', `${product.seer} / ${product.scop}`],
    ['Уровень шума', product.noise],
    ['Расход воздуха', product.airFlow],
    ['Хладагент', product.refrigerant],
    ['Компрессор', product.compressor],
    ['Максимальная длина трассы', product.pipe],
    ['Перепад высот', product.height],
    ['Работа на охлаждение', product.coolingRange],
    ['Работа на обогрев', product.heatingRange],
    ['Внутренний блок', product.indoorSize],
    ['Наружный блок', product.outdoorSize]
  ];

  const message = `Здравствуйте! Интересует ${product.title}, модель ${product.model}. Подскажите стоимость и наличие.`;

  root.innerHTML = `
    <div class="breadcrumbs"><a href="../index.html">Главная</a><span>—</span><a href="../catalog.html">Каталог</a><span>—</span><span>${window.YUKO.escape(product.title)}</span></div>
    <section class="product-hero">
      <div class="product-gallery" data-reveal>
        <span class="product-gallery__brand">${window.YUKO.escape(product.brand)}</span>
        <span class="product-gallery__badge">${window.YUKO.escape(product.badge)}</span>
        <img src="../assets/images/${product.image}" alt="${window.YUKO.escape(product.title)}">
        <div class="product-gallery__note">Изображение представлено для ознакомления. Внешний вид комплектации может незначительно отличаться.</div>
      </div>
      <div class="product-summary" data-reveal>
        <div class="eyebrow">${window.YUKO.escape(product.brand)} · ${window.YUKO.escape(product.series)}</div>
        <h1>${window.YUKO.escape(product.title)}</h1>
        <p class="product-summary__model">${window.YUKO.escape(product.model)}</p>
        <p class="product-summary__description">${window.YUKO.escape(product.description)}</p>
        <div class="product-kpis">
          <div><b>${product.area} м²</b><span>площадь</span></div>
          <div><b>${window.YUKO.escape(product.cooling)}</b><span>охлаждение</span></div>
          <div><b>${window.YUKO.escape(product.noise)}</b><span>шум</span></div>
          <div><b>${window.YUKO.escape(product.energy)}</b><span>энергокласс</span></div>
        </div>
        <div class="product-price"><span>Актуальная стоимость</span><strong>По запросу</strong><small>Уточним наличие, цену и условия монтажа</small></div>
        <div class="product-actions">
          <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">Узнать цену в WhatsApp</a>
          <a class="button button--outline" href="tel:+998875010999">Позвонить</a>
        </div>
        <div class="trust-line"><span>✓ Подбор по площади</span><span>✓ Консультация</span><span>✓ Монтаж по запросу</span></div>
      </div>
    </section>

    <section class="product-details" data-tabs>
      <div class="tabs" role="tablist">
        <button class="tab is-active" type="button" data-tab="features">Преимущества</button>
        <button class="tab" type="button" data-tab="specs">Характеристики</button>
        <button class="tab" type="button" data-tab="delivery">Подбор и монтаж</button>
      </div>
      <div class="tab-panel is-active" data-panel="features">
        <div class="feature-list">
          ${product.features.map((feature, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><h3>${window.YUKO.escape(feature)}</h3></article>`).join('')}
        </div>
      </div>
      <div class="tab-panel" data-panel="specs">
        <div class="spec-table">
          ${specs.map(([label, value]) => `<div><span>${window.YUKO.escape(label)}</span><strong>${window.YUKO.escape(value)}</strong></div>`).join('')}
        </div>
      </div>
      <div class="tab-panel" data-panel="delivery">
        <div class="service-grid">
          <article><span>01</span><h3>Уточняем задачу</h3><p>Площадь, солнечная сторона, этаж, назначение помещения и желаемый бюджет.</p></article>
          <article><span>02</span><h3>Подбираем модель</h3><p>Сравниваем мощность, шум, энергоэффективность и функциональность.</p></article>
          <article><span>03</span><h3>Согласовываем монтаж</h3><p>Рассчитываем трассу и необходимые работы после осмотра объекта.</p></article>
        </div>
      </div>
    </section>

    <section class="product-contact" data-reveal>
      <div><span class="eyebrow">Yuko Global · Самарканд</span><h2>Нужна консультация по этой модели?</h2><p>Менеджер уточнит актуальное наличие и поможет рассчитать мощность для вашего помещения.</p></div>
      <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">Связаться с менеджером</a>
    </section>`;

  root.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = `https://wa.me/998875010999?text=${encodeURIComponent(link.dataset.message)}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });

  const tabs = root.querySelectorAll('[data-tab]');
  const panels = root.querySelectorAll('[data-panel]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((node) => node.classList.toggle('is-active', node === tab));
      panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === tab.dataset.tab));
    });
  });

  requestAnimationFrame(() => root.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
})();
