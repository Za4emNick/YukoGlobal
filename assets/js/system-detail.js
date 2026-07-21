(function () {
  const run = () => {
  const root = document.querySelector('[data-system-root]');
  if (!root || !window.YUKO_SYSTEMS || !window.YUKO) return;

  const t = window.YUKO.t;
  const language = window.YUKO.language;
  const localizedSystems = window.YUKO_SYSTEMS.map(window.YUKO.localizeSystem);
  const id = new URLSearchParams(window.location.search).get('id');
  const item = localizedSystems.find((entry) => entry.id === id) || localizedSystems[0];
  const gallery = item.gallery?.length ? item.gallery : [item.image];
  const related = localizedSystems.filter((entry) => entry.group === item.group && entry.id !== item.id).slice(0, 3);
  const brands = item.brands || ['MDV'];

  document.title = `${item.title} — Yuko Global`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    const description = language === 'uz'
      ? `${item.title}: qo‘llanishi, afzalliklari, brendlar va Yuko Global’da uskunani tanlash.`
      : language === 'en'
        ? `${item.title}: applications, benefits, brands, and equipment selection from Yuko Global.`
        : `${item.title}: назначение, преимущества, бренды и подбор оборудования в Yuko Global.`;
    meta.setAttribute('content', description);
  }

  const message = language === 'uz'
    ? `Assalomu alaykum! “${item.title}” toifasi qiziqtirmoqda. Mavjud variantlar, narx va tanlash uchun kerakli ma’lumotlarni ayting.`
    : language === 'en'
      ? `Hello! I am interested in the “${item.title}” category. Please advise on available options, price, and the information needed for selection.`
      : `Здравствуйте! Интересует категория «${item.title}». Подскажите доступные варианты, стоимость и что нужно для подбора.`;

  const brandWord = language === 'uz' ? 'brend' : language === 'en' ? (brands.length === 1 ? 'brand' : 'brands') : (brands.length === 1 ? 'бренд' : 'бренда');
  const imageLabel = language === 'uz' ? 'Rasm' : language === 'en' ? 'Image' : 'Изображение';

  root.innerHTML = `
    <div class="breadcrumbs"><a href="${window.YUKO.withLanguage('index.html')}">${window.YUKO.escape(t('Главная'))}</a><span>—</span><a href="${window.YUKO.withLanguage('systems.html')}">${window.YUKO.escape(t('Системы'))}</a><span>—</span><span>${window.YUKO.escape(item.title)}</span></div>
    <section class="system-detail-hero">
      <div class="system-detail__gallery" data-reveal>
        <div class="system-detail__visual"><img data-system-main-image src="assets/images/${gallery[0]}" alt="${window.YUKO.escape(item.title)}"></div>
        ${gallery.length > 1 ? `<div class="system-thumbs">${gallery.map((image, index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}" data-system-thumb="assets/images/${image}" aria-label="${imageLabel} ${index + 1}"><img src="assets/images/${image}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="system-detail__summary" data-reveal>
        <span class="eyebrow">${window.YUKO.escape(item.group)}</span>
        <h1>${window.YUKO.escape(item.title)}</h1>
        <p class="system-lead">${window.YUKO.escape(item.description)}</p>
        <div class="brand-chips brand-chips--large">${brands.map((brand) => `<span>${window.YUKO.escape(brand)}</span>`).join('')}</div>
        <div class="product-kpis system-kpis">
          <div><b>${brands.length}</b><span>${brandWord}</span></div>
          <div><b>${window.YUKO.escape(t('Под объект'))}</b><span>${window.YUKO.escape(t('расчёт мощности'))}</span></div>
          <div><b>${window.YUKO.escape(t('По запросу'))}</b><span>${window.YUKO.escape(t('цена и наличие'))}</span></div>
          <div><b>${window.YUKO.escape(t('Самарканд'))}</b><span>${window.YUKO.escape(t('контактный офис'))}</span></div>
        </div>
        <div class="product-actions">
          <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">${window.YUKO.escape(t('Запросить предложение'))}</a>
          <a class="button button--outline" href="tel:+998875010999">${window.YUKO.escape(t('Позвонить'))}</a>
        </div>
        <p class="system-note">${window.YUKO.escape(item.note)}</p>
      </div>
    </section>

    <section class="system-facts" data-reveal>
      <article><span>01</span><h3>${window.YUKO.escape(t('Где применяется'))}</h3><ul>${item.applications.map((value) => `<li>${window.YUKO.escape(value)}</li>`).join('')}</ul></article>
      <article><span>02</span><h3>${window.YUKO.escape(t('Ключевые преимущества'))}</h3><ul>${item.benefits.map((value) => `<li>${window.YUKO.escape(value)}</li>`).join('')}</ul></article>
      <article><span>03</span><h3>${window.YUKO.escape(t('Что нужно для подбора'))}</h3><ul><li>${window.YUKO.escape(t('Площадь и высота помещения'))}</li><li>${window.YUKO.escape(t('Назначение и режим работы объекта'))}</li><li>${window.YUKO.escape(t('Количество отдельных зон'))}</li><li>${window.YUKO.escape(t('Планировка или проект при наличии'))}</li></ul></article>
    </section>

    <section class="system-project-note" data-reveal>
      <div><span class="eyebrow">${window.YUKO.escape(t('Подбор и поставка'))}</span><h2>${window.YUKO.escape(t('Оборудование рассчитывается под реальные условия объекта.'))}</h2></div>
      <p>${window.YUKO.escape(item.modelsNote)}</p>
    </section>

    ${related.length ? `<section class="related-systems" data-reveal><div class="section-heading"><div><span class="eyebrow">${window.YUKO.escape(t('В этом же разделе'))}</span><h2>${window.YUKO.escape(t('Смотрите также'))}</h2></div><a class="section-link" href="${window.YUKO.withLanguage('systems.html')}">${window.YUKO.escape(t('Все системы →'))}</a></div><div class="systems-grid systems-grid--related">${related.map((entry) => `<article class="system-card"><a class="system-card__visual" href="${window.YUKO.withLanguage(`system-detail.html?id=${encodeURIComponent(entry.id)}`)}"><img src="assets/images/${entry.image}" alt="${window.YUKO.escape(entry.title)}" loading="lazy"></a><div class="system-card__body"><div class="system-card__brands">${(entry.brands || []).map((brand) => `<span>${window.YUKO.escape(brand)}</span>`).join('')}</div><h3><a href="${window.YUKO.withLanguage(`system-detail.html?id=${encodeURIComponent(entry.id)}`)}">${window.YUKO.escape(entry.title)}</a></h3><a class="system-card__link" href="${window.YUKO.withLanguage(`system-detail.html?id=${encodeURIComponent(entry.id)}`)}">${window.YUKO.escape(t('Подробнее'))} <span>↗</span></a></div></article>`).join('')}</div></section>` : ''}

    <section class="product-contact" data-reveal>
      <div><span class="eyebrow">Yuko Global · ${window.YUKO.escape(t('Самарканд'))}</span><h2>${window.YUKO.escape(t('Нужна поставка или проектный подбор?'))}</h2><p>${window.YUKO.escape(t('Отправьте основные параметры объекта. Мы уточним конфигурацию, доступные бренды и актуальную стоимость.'))}</p></div>
      <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">${window.YUKO.escape(t('Связаться с менеджером'))}</a>
    </section>`;

  window.YUKO.applyWhatsAppLinks(root);

  const mainImage = root.querySelector('[data-system-main-image]');
  root.querySelectorAll('[data-system-thumb]').forEach((button) => {
    button.addEventListener('click', () => {
      if (mainImage) mainImage.src = button.dataset.systemThumb;
      root.querySelectorAll('[data-system-thumb]').forEach((node) => node.classList.toggle('is-active', node === button));
    });
  });

  requestAnimationFrame(() => root.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
  };
  (window.YUKO_READY || Promise.resolve()).then(run);
})();
