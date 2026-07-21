(function () {
  const run = () => {
  const grid = document.querySelector('[data-featured-products]');
  if (!grid || !window.YUKO_PRODUCTS || !window.YUKO) return;
  const t = window.YUKO.t;
  const picks = ['mdv-forest-inverter-12', 'mdv-aurora-design-silver-12', 'general-eco-range-12'];
  const products = picks
    .map((id) => window.YUKO_PRODUCTS.find((item) => item.id === id))
    .filter(Boolean)
    .map(window.YUKO.localizeProduct);

  grid.innerHTML = products.map((product) => `
    <a class="featured-product" href="${window.YUKO.productUrl(product)}" data-reveal>
      <span class="featured-product__badge">${window.YUKO.escape(product.badge)}</span>
      <img src="${window.YUKO.imageUrl(product)}" alt="${window.YUKO.escape(product.title)}">
      <div><small>${window.YUKO.escape(product.brand)} · ${window.YUKO.escape(t(`до ${product.area} м²`))}</small><h3>${window.YUKO.escape(product.title)}</h3><p>${window.YUKO.escape(product.cooling)} · ${window.YUKO.escape(product.noise)}</p><strong>${window.YUKO.escape(t('Подробнее'))} →</strong></div>
    </a>`).join('');

  requestAnimationFrame(() => grid.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
  };
  (window.YUKO_READY || Promise.resolve()).then(run);
})();
