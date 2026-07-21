(function () {
  const root = document.querySelector('[data-system-root]');
  if (!root || !window.YUKO_SYSTEMS) return;
  const id = new URLSearchParams(window.location.search).get('id');
  const item = window.YUKO_SYSTEMS.find((entry) => entry.id === id) || window.YUKO_SYSTEMS[0];
  const gallery = item.gallery?.length ? item.gallery : [item.image];
  const related = window.YUKO_SYSTEMS.filter((entry) => entry.group === item.group && entry.id !== item.id).slice(0, 3);
  const brands = item.brands || ['MDV'];

  document.title = `${item.title} — Yuko Global`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', `${item.title}: назначение, преимущества, бренды и подбор оборудования в Yuko Global.`);
  const message = `Здравствуйте! Интересует категория «${item.title}». Подскажите доступные варианты, стоимость и что нужно для подбора.`;

  root.innerHTML = `
    <div class="breadcrumbs"><a href="index.html">Главная</a><span>—</span><a href="systems.html">Системы</a><span>—</span><span>${window.YUKO.escape(item.title)}</span></div>
    <section class="system-detail-hero">
      <div class="system-detail__gallery" data-reveal>
        <div class="system-detail__visual"><img data-system-main-image src="assets/images/${gallery[0]}" alt="${window.YUKO.escape(item.title)}"></div>
        ${gallery.length > 1 ? `<div class="system-thumbs">${gallery.map((image, index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}" data-system-thumb="assets/images/${image}" aria-label="Изображение ${index + 1}"><img src="assets/images/${image}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="system-detail__summary" data-reveal>
        <span class="eyebrow">${window.YUKO.escape(item.group)}</span>
        <h1>${window.YUKO.escape(item.title)}</h1>
        <p class="system-lead">${window.YUKO.escape(item.description)}</p>
        <div class="brand-chips brand-chips--large">${brands.map((brand) => `<span>${window.YUKO.escape(brand)}</span>`).join('')}</div>
        <div class="product-kpis system-kpis">
          <div><b>${brands.length}</b><span>${brands.length === 1 ? 'бренд' : 'бренда'}</span></div>
          <div><b>Под объект</b><span>расчёт мощности</span></div>
          <div><b>По запросу</b><span>цена и наличие</span></div>
          <div><b>Самарканд</b><span>контактный офис</span></div>
        </div>
        <div class="product-actions">
          <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">Запросить предложение</a>
          <a class="button button--outline" href="tel:+998875010999">Позвонить</a>
        </div>
        <p class="system-note">${window.YUKO.escape(item.note)}</p>
      </div>
    </section>

    <section class="system-facts" data-reveal>
      <article><span>01</span><h3>Где применяется</h3><ul>${item.applications.map((value) => `<li>${window.YUKO.escape(value)}</li>`).join('')}</ul></article>
      <article><span>02</span><h3>Ключевые преимущества</h3><ul>${item.benefits.map((value) => `<li>${window.YUKO.escape(value)}</li>`).join('')}</ul></article>
      <article><span>03</span><h3>Что нужно для подбора</h3><ul><li>Площадь и высота помещения</li><li>Назначение и режим работы объекта</li><li>Количество отдельных зон</li><li>Планировка или проект при наличии</li></ul></article>
    </section>

    <section class="system-project-note" data-reveal>
      <div><span class="eyebrow">Подбор и поставка</span><h2>Оборудование рассчитывается под реальные условия объекта.</h2></div>
      <p>${window.YUKO.escape(item.modelsNote)}</p>
    </section>

    ${related.length ? `<section class="related-systems" data-reveal><div class="section-heading"><div><span class="eyebrow">В этом же разделе</span><h2>Смотрите также</h2></div><a class="section-link" href="systems.html">Все системы →</a></div><div class="systems-grid systems-grid--related">${related.map((entry) => `<article class="system-card"><a class="system-card__visual" href="system-detail.html?id=${encodeURIComponent(entry.id)}"><img src="assets/images/${entry.image}" alt="${window.YUKO.escape(entry.title)}" loading="lazy"></a><div class="system-card__body"><div class="system-card__brands">${(entry.brands || []).map((brand) => `<span>${window.YUKO.escape(brand)}</span>`).join('')}</div><h3><a href="system-detail.html?id=${encodeURIComponent(entry.id)}">${window.YUKO.escape(entry.title)}</a></h3><a class="system-card__link" href="system-detail.html?id=${encodeURIComponent(entry.id)}">Подробнее <span>↗</span></a></div></article>`).join('')}</div></section>` : ''}

    <section class="product-contact" data-reveal>
      <div><span class="eyebrow">Yuko Global · Самарканд</span><h2>Нужна поставка или проектный подбор?</h2><p>Отправьте основные параметры объекта. Мы уточним конфигурацию, доступные бренды и актуальную стоимость.</p></div>
      <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(message)}" href="#">Связаться с менеджером</a>
    </section>`;

  root.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = `https://wa.me/998875010999?text=${encodeURIComponent(link.dataset.message)}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });

  const mainImage = root.querySelector('[data-system-main-image]');
  root.querySelectorAll('[data-system-thumb]').forEach((button) => {
    button.addEventListener('click', () => {
      if (mainImage) mainImage.src = button.dataset.systemThumb;
      root.querySelectorAll('[data-system-thumb]').forEach((node) => node.classList.toggle('is-active', node === button));
    });
  });

  requestAnimationFrame(() => root.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
})();
