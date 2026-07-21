(function () {
  const grid = document.querySelector('[data-catalog-grid]');
  if (!grid || !window.YUKO_PRODUCTS) return;

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
    inverter: 'Инвертор',
    onoff: 'On/Off',
    design: 'Дизайнерская'
  };

  function card(product) {
    return `
      <article class="product-card" data-reveal>
        <a class="product-card__visual" href="${window.YUKO.productUrl(product)}" aria-label="${window.YUKO.escape(product.title)}">
          <span class="product-card__badge">${window.YUKO.escape(product.badge)}</span>
          <img src="${window.YUKO.imageUrl(product)}" alt="${window.YUKO.escape(product.title)}" loading="lazy">
        </a>
        <div class="product-card__body">
          <div class="product-card__meta"><span>${window.YUKO.escape(product.brand)}</span><span>${categoryNames[product.category] || product.category}</span></div>
          <h3><a href="${window.YUKO.productUrl(product)}">${window.YUKO.escape(product.title)}</a></h3>
          <p class="product-card__model">${window.YUKO.escape(product.model)}</p>
          <div class="product-card__specs">
            <span><b>${product.area} м²</b> площадь</span>
            <span><b>${window.YUKO.escape(product.cooling)}</b> холод</span>
            <span><b>${window.YUKO.escape(product.noise)}</b> шум</span>
          </div>
          <div class="product-card__footer">
            <div><small>Стоимость</small><strong>По запросу</strong></div>
            <a class="button button--small button--light" href="${window.YUKO.productUrl(product)}">Подробнее</a>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const query = (search?.value || '').toLowerCase().trim();
    const brandValue = brand?.value || 'all';
    const categoryValue = category?.value || 'all';
    const areaValue = Number(area?.value || 0);

    const items = window.YUKO_PRODUCTS.filter((product) => {
      const haystack = `${product.title} ${product.model} ${product.series} ${product.brand}`.toLowerCase();
      const matchQuery = !query || haystack.includes(query);
      const matchBrand = brandValue === 'all' || product.brand === brandValue;
      const matchCategory = categoryValue === 'all' || product.category === categoryValue;
      const matchArea = !areaValue || product.area <= areaValue;
      return matchQuery && matchBrand && matchCategory && matchArea;
    });

    grid.innerHTML = items.length ? items.map(card).join('') : `
      <div class="empty-state">
        <span>Ничего не найдено</span>
        <h3>Измените параметры фильтра</h3>
        <p>Или свяжитесь с менеджером — подберём оборудование под ваш объект.</p>
      </div>`;
    if (count) count.textContent = String(items.length);

    const revealNodes = grid.querySelectorAll('[data-reveal]');
    requestAnimationFrame(() => revealNodes.forEach((node) => node.classList.add('is-visible')));
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
})();
