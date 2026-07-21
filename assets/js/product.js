(function () {
  const run = () => {
  const root = document.querySelector('[data-product-root]');
  const id = document.body.dataset.productId;
  if (!root || !id || !window.YUKO_PRODUCTS || !window.YUKO) return;

  const t = window.YUKO.t;
  const sourceProduct = window.YUKO_PRODUCTS.find((item) => item.id === id);
  const product = sourceProduct ? window.YUKO.localizeProduct(sourceProduct) : null;

  if (!product) {
    root.innerHTML = `<div class="empty-state"><h1>${window.YUKO.escape(t('Товар не найден'))}</h1><a class="button button--light" href="${window.YUKO.withLanguage('../catalog.html')}">${window.YUKO.escape(t('Вернуться в каталог'))}</a></div>`;
    return;
  }

  document.title = `${product.title} — Yuko Global`;
  const pageDescription = window.YUKO.language === 'uz'
    ? `${product.title}: sovutish quvvati ${product.cooling}, maydon ${product.area} m² gacha. Samarqandda sotuv va tanlash.`
    : window.YUKO.language === 'en'
      ? `${product.title}: ${product.cooling} cooling capacity, for areas up to ${product.area} m². Sales and selection in Samarkand.`
      : `${product.title}: ${product.cooling} на охлаждение, площадь до ${product.area} м². Продажа и подбор в Самарканде.`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', pageDescription);

  const specs = [
    [t('Модель'), product.model],
    [t('Рекомендуемая площадь'), t(`до ${product.area} м²`)],
    [t('Мощность охлаждения'), product.cooling],
    [t('Мощность обогрева'), product.heating],
    [t('Потребление при охлаждении'), product.powerCooling],
    [t('Класс энергоэффективности'), product.energy],
    ['SEER / SCOP', `${product.seer} / ${product.scop}`],
    [t('Уровень шума'), product.noise],
    [t('Расход воздуха'), product.airFlow],
    [t('Хладагент'), product.refrigerant],
    [t('Компрессор'), product.compressor],
    [t('Максимальная длина трассы'), product.pipe],
    [t('Перепад высот'), product.height],
    [t('Работа на охлаждение'), product.coolingRange],
    [t('Работа на обогрев'), product.heatingRange],
    [t('Внутренний блок'), product.indoorSize],
    [t('Наружный блок'), product.outdoorSize]
  ];

  const message = window.YUKO.language === 'uz'
    ? `Assalomu alaykum! ${product.title}, ${product.model} modeli qiziqtirmoqda. Narxi va mavjudligini ayting.`
    : window.YUKO.language === 'en'
      ? `Hello! I am interested in ${product.title}, model ${product.model}. Please confirm the price and availability.`
      : `Здравствуйте! Интересует ${product.title}, модель ${product.model}. Подскажите стоимость и наличие.`;

  const referenceNote = window.YUKO.language === 'uz'
    ? 'Rasm tanishish uchun berilgan. Yetkazib beriladigan komplektning ko‘rinishi biroz farq qilishi mumkin.'
    : window.YUKO.language === 'en'
      ? 'The image is for reference. The appearance of the supplied configuration may vary slightly.'
      : 'Изображение представлено для ознакомления. Внешний вид комплектации может незначительно отличаться.';

  root.innerHTML = `
    <div class="breadcrumbs"><a href="${window.YUKO.withLanguage('../index.html')}">${window.YUKO.escape(t('Главная'))}</a><span>—</span><a href="${window.YUKO.withLanguage('../catalog.html')}">${window.YUKO.escape(t('Каталог'))}</a><span>—</span><span>${window.YUKO.escape(product.title)}</span></div>
    <section class="product-hero">
      <div class="product-gallery" data-reveal>
        <span class="product-gallery__brand">${window.YUKO.escape(product.brand)}</span>
        <span class="product-gallery__badge">${window.YUKO.escape(product.badge)}</span>
        <img src="../assets/images/${product.image}" alt="${window.YUKO.escape(product.title)}">
        <div class="product-gallery__note">${window.YUKO.escape(referenceNote)}</div>
      </div>
      <div class="product-summary" data-reveal>
        <div class="eyebrow">${window.YUKO.escape(product.brand)} · ${window.YUKO.escape(product.series)}</div>
        <h1>${window.YUKO.escape(product.title)}</h1>
        <p class="product-summary__model">${window.YUKO.escape(product.model)}</p>
        <p class="product-summary__description">${window.YUKO.escape(product.description)}</p>
        <div class="product-kpis">
          <div><b>${product.area} m²</b><span>${window.YUKO.escape(t('площадь'))}</span></div>
          <div><b>${window.YUKO.escape(product.cooling)}</b><span>${window.YUKO.escape(t('охлаждение'))}</span></div>
          <div><b>${window.YUKO.escape(product.noise)}</b><span>${window.YUKO.escape(t('шум'))}</span></div>
          <div><b>${window.YUKO.escape(product.energy)}</b><span>${window.YUKO.escape(t('энергокласс'))}</span></div>
        </div>
        <div class="product-price"><span>${window.YUKO.escape(t('Актуальная стоимость'))}</span><strong>${window.YUKO.escape(t('По запросу'))}</strong><small>${window.YUKO.escape(t('Уточним наличие, цену и условия монтажа'))}</small></div>
        <div class="product-actions">
          <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">${window.YUKO.escape(t('Узнать цену в WhatsApp'))}</a>
          <a class="button button--outline" href="tel:+998875010999">${window.YUKO.escape(t('Позвонить'))}</a>
        </div>
        <div class="trust-line"><span>✓ ${window.YUKO.escape(t('Подбор по площади'))}</span><span>✓ ${window.YUKO.escape(t('Консультация'))}</span><span>✓ ${window.YUKO.escape(t('Монтаж по запросу'))}</span></div>
      </div>
    </section>

    <section class="product-details" data-tabs>
      <div class="tabs" role="tablist">
        <button class="tab is-active" type="button" data-tab="features">${window.YUKO.escape(t('Преимущества'))}</button>
        <button class="tab" type="button" data-tab="specs">${window.YUKO.escape(t('Характеристики'))}</button>
        <button class="tab" type="button" data-tab="delivery">${window.YUKO.escape(t('Подбор и монтаж'))}</button>
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
          <article><span>01</span><h3>${window.YUKO.escape(t('Уточняем задачу'))}</h3><p>${window.YUKO.escape(t('Площадь, солнечная сторона, этаж, назначение помещения и желаемый бюджет.'))}</p></article>
          <article><span>02</span><h3>${window.YUKO.escape(t('Подбираем модель'))}</h3><p>${window.YUKO.escape(t('Сравниваем мощность, шум, энергоэффективность и функциональность.'))}</p></article>
          <article><span>03</span><h3>${window.YUKO.escape(t('Согласовываем монтаж'))}</h3><p>${window.YUKO.escape(t('Рассчитываем трассу и необходимые работы после осмотра объекта.'))}</p></article>
        </div>
      </div>
    </section>

    <section class="product-contact" data-reveal>
      <div><span class="eyebrow">Yuko Global · ${window.YUKO.escape(t('Самарканд'))}</span><h2>${window.YUKO.escape(t('Нужна консультация по этой модели?'))}</h2><p>${window.YUKO.escape(t('Менеджер уточнит актуальное наличие и поможет рассчитать мощность для вашего помещения.'))}</p></div>
      <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">${window.YUKO.escape(t('Связаться с менеджером'))}</a>
    </section>`;

  window.YUKO.applyWhatsAppLinks(root);

  const tabs = root.querySelectorAll('[data-tab]');
  const panels = root.querySelectorAll('[data-panel]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((node) => node.classList.toggle('is-active', node === tab));
      panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === tab.dataset.tab));
    });
  });

  requestAnimationFrame(() => root.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
  };
  (window.YUKO_READY || Promise.resolve()).then(run);
})();
