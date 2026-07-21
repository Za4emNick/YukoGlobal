(function () {
  const run = () => {
  const grid = document.querySelector('[data-catalog-grid]');
  if (!grid || !window.YUKO_PRODUCTS || !window.YUKO) return;

  const t = window.YUKO.t;
  const products = window.YUKO_PRODUCTS.map(window.YUKO.localizeProduct);
  const search = document.querySelector('[data-filter-search]');
  const brand = document.querySelector('[data-filter-brand]');
  const category = document.querySelector('[data-filter-category]');
  const area = document.querySelector('[data-filter-area]');
  const count = document.querySelector('[data-product-count]');
  const reset = document.querySelector('[data-filter-reset]');

  const params = new URLSearchParams(window.location.search);
  const initialBrand = params.get('brand');
  const initialType = params.get('type');
  if (brand && ['MDV', 'GENERAL'].includes(initialBrand)) brand.value = initialBrand;
  if (category && ['inverter', 'onoff', 'design'].includes(initialType)) category.value = initialType;

  const categoryNames = {
    inverter: t('Инвертор'),
    onoff: 'On/Off',
    design: t('Дизайнерская')
  };

  function card(product) {
    return `
      <article class="product-card" data-reveal>
        <a class="product-card__visual" href="${window.YUKO.productUrl(product)}" aria-label="${window.YUKO.escape(product.title)}">
          <span class="product-card__badge">${window.YUKO.escape(product.badge)}</span>
          <img src="${window.YUKO.imageUrl(product)}" alt="${window.YUKO.escape(product.title)}" loading="lazy">
        </a>
        <div class="product-card__body">
          <div class="product-card__meta"><span>${window.YUKO.escape(product.brand)}</span><span>${window.YUKO.escape(categoryNames[product.category] || product.category)}</span></div>
          <h3><a href="${window.YUKO.productUrl(product)}">${window.YUKO.escape(product.title)}</a></h3>
          <p class="product-card__model">${window.YUKO.escape(product.model)}</p>
          <div class="product-card__specs">
            <span><b>${product.area} m²</b> ${window.YUKO.escape(t('площадь'))}</span>
            <span><b>${window.YUKO.escape(product.cooling)}</b> ${window.YUKO.escape(t('холод'))}</span>
            <span><b>${window.YUKO.escape(product.noise)}</b> ${window.YUKO.escape(t('шум'))}</span>
          </div>
          <div class="product-card__footer">
            <div><small>${window.YUKO.escape(t('Стоимость'))}</small><strong>${window.YUKO.escape(t('По запросу'))}</strong></div>
            <a class="button button--small button--light" href="${window.YUKO.productUrl(product)}">${window.YUKO.escape(t('Подробнее'))}</a>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const query = (search?.value || '').toLowerCase().trim();
    const brandValue = brand?.value || 'all';
    const categoryValue = category?.value || 'all';
    const areaValue = Number(area?.value || 0);

    const items = products.filter((product) => {
      const haystack = `${product.title} ${product.model} ${product.series} ${product.brand}`.toLowerCase();
      const matchQuery = !query || haystack.includes(query);
      const matchBrand = brandValue === 'all' || product.brand === brandValue;
      const matchCategory = categoryValue === 'all' || product.category === categoryValue;
      const matchArea = !areaValue || product.area <= areaValue;
      return matchQuery && matchBrand && matchCategory && matchArea;
    });

    grid.innerHTML = items.length ? items.map(card).join('') : `
      <div class="empty-state">
        <span>${window.YUKO.escape(t('Ничего не найдено'))}</span>
        <h3>${window.YUKO.escape(t('Измените параметры фильтра'))}</h3>
        <p>${window.YUKO.escape(t('Или свяжитесь с менеджером — подберём оборудование под ваш объект.'))}</p>
      </div>`;
    if (count) count.textContent = String(items.length);

    requestAnimationFrame(() => grid.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
  }

  [search, brand, category, area].forEach((control) => control?.addEventListener('input', render));
  reset?.addEventListener('click', () => {
    if (search) search.value = '';
    if (brand) brand.value = 'all';
    if (category) category.value = 'all';
    if (area) area.value = '0';
    render();
  });

  render();
  };
  (window.YUKO_READY || Promise.resolve()).then(run);
})();
