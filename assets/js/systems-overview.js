(function () {
  const root = document.querySelector('[data-systems-overview]');
  if (!root || !window.YUKO_SYSTEMS) return;

  const groupMeta = {
    'Бытовые сплит-системы': {
      id: 'household', label: 'Дом и небольшой бизнес',
      text: 'Настенные, кассетные, канальные и консольные решения для квартир, домов, офисов и небольших коммерческих помещений.'
    },
    'Тепловые насосы': {
      id: 'heat-pumps', label: 'Отопление и охлаждение',
      text: 'Энергоэффективные системы воздух–воздух и воздух–вода для создания круглогодичного микроклимата.'
    },
    'Полупромышленные сплит-системы': {
      id: 'semi-industrial', label: 'Офисы, магазины и залы',
      text: 'Производительное оборудование для объектов с повышенной нагрузкой и большой площадью.'
    },
    'Мультисплит-системы': {
      id: 'multisplit', label: 'Несколько помещений',
      text: 'Разные типы внутренних блоков, подключаемые к одному наружному агрегату, включая Mini VRF Atom.'
    },
    'Мультизональные системы VRF': {
      id: 'vrf', label: 'Проектные объекты',
      text: 'Масштабируемые решения для гостиниц, бизнес-центров, клиник и многофункциональных зданий.'
    },
    'Промышленные системы': {
      id: 'industrial', label: 'Инженерная инфраструктура',
      text: 'Чиллеры, фанкойлы, компрессорно-конденсаторные блоки и руфтопы для крупных объектов.'
    }
  };

  const groups = {};
  window.YUKO_SYSTEMS.forEach((item) => ((groups[item.group] ||= []).push(item)));
  const orderedGroups = window.YUKO_SYSTEM_GROUP_ORDER.filter((name) => groups[name]);

  root.innerHTML = `
    <div class="systems-jump" data-reveal>
      ${orderedGroups.map((name) => {
        const meta = groupMeta[name];
        return `<a href="#${meta.id}"><span>${window.YUKO.escape(meta.label)}</span><b>${groups[name].length}</b></a>`;
      }).join('')}
    </div>
    ${orderedGroups.map((groupName, groupIndex) => {
      const items = groups[groupName];
      const meta = groupMeta[groupName];
      const allBrands = [...new Set(items.flatMap((item) => item.brands || []))];
      return `
        <section class="systems-group" id="${meta.id}" data-reveal>
          <div class="systems-group__head">
            <div>
              <span class="eyebrow">${String(groupIndex + 1).padStart(2, '0')} · ${window.YUKO.escape(meta.label)}</span>
              <h2>${window.YUKO.escape(groupName)}</h2>
            </div>
            <div class="systems-group__aside">
              <p>${window.YUKO.escape(meta.text)}</p>
              <div class="brand-chips">${allBrands.map((brand) => `<span>${window.YUKO.escape(brand)}</span>`).join('')}</div>
            </div>
          </div>
          <div class="systems-grid">
            ${items.map((item) => `
              <article class="system-card">
                <a class="system-card__visual" href="system-detail.html?id=${encodeURIComponent(item.id)}">
                  <img src="assets/images/${item.image}" alt="${window.YUKO.escape(item.title)}" loading="lazy">
                  <span class="system-card__index">${String(items.indexOf(item) + 1).padStart(2, '0')}</span>
                </a>
                <div class="system-card__body">
                  <div class="system-card__brands">${(item.brands || []).map((brand) => `<span>${window.YUKO.escape(brand)}</span>`).join('')}</div>
                  <h3><a href="system-detail.html?id=${encodeURIComponent(item.id)}">${window.YUKO.escape(item.title)}</a></h3>
                  <p>${window.YUKO.escape(item.description)}</p>
                  <a class="system-card__link" href="system-detail.html?id=${encodeURIComponent(item.id)}">Подробнее <span>↗</span></a>
                </div>
              </article>`).join('')}
          </div>
        </section>`;
    }).join('')}
    <section class="systems-help" data-reveal>
      <div><span class="eyebrow">Не знаете, с чего начать?</span><h2>Подберём систему под планировку и задачу.</h2><p>Сообщите площадь, назначение объекта и количество помещений. Менеджер Yuko Global предложит подходящий класс оборудования и запросит технические данные только при необходимости.</p></div>
      <a class="button button--light" data-whatsapp data-message="Здравствуйте! Нужна помощь с подбором климатической системы для объекта." href="#">Получить консультацию</a>
    </section>`;

  root.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = `https://wa.me/998875010999?text=${encodeURIComponent(link.dataset.message)}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });
  requestAnimationFrame(() => root.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
})();
