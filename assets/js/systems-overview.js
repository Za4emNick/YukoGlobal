(function () {
  const run = () => {
  const root = document.querySelector('[data-systems-overview]');
  if (!root || !window.YUKO_SYSTEMS || !window.YUKO) return;

  const t = window.YUKO.t;
  const language = window.YUKO.language;
  const sourceOrder = window.YUKO_SYSTEM_GROUP_ORDER || [];
  const items = window.YUKO_SYSTEMS.map(window.YUKO.localizeSystem);
  const localizedOrder = sourceOrder.map((group) => {
    const match = window.YUKO_SYSTEMS.find((item) => item.group === group);
    return match ? window.YUKO.localizeSystem(match).group : t(group);
  });

  const localizedMeta = {
    ru: [
      ['household', 'Дом и небольшой бизнес', 'Настенные, кассетные, канальные и консольные решения для квартир, домов, офисов и небольших коммерческих помещений.'],
      ['heat-pumps', 'Отопление и охлаждение', 'Энергоэффективные системы воздух–воздух и воздух–вода для создания круглогодичного микроклимата.'],
      ['semi-industrial', 'Офисы, магазины и залы', 'Производительное оборудование для объектов с повышенной нагрузкой и большой площадью.'],
      ['multisplit', 'Несколько помещений', 'Разные типы внутренних блоков, подключаемые к одному наружному агрегату, включая Mini VRF Atom.'],
      ['vrf', 'Проектные объекты', 'Масштабируемые решения для гостиниц, бизнес-центров, клиник и многофункциональных зданий.'],
      ['industrial', 'Инженерная инфраструктура', 'Чиллеры, фанкойлы, компрессорно-конденсаторные блоки и руфтопы для крупных объектов.']
    ],
    uz: [
      ['household', 'Uy va kichik biznes', 'Kvartira, uy, ofis va kichik tijorat xonalari uchun devoriy, kassetali, kanalli va konsol yechimlar.'],
      ['heat-pumps', 'Isitish va sovutish', 'Yil bo‘yi qulay mikroiqlim yaratish uchun energiya tejamkor havo–havo va havo–suv tizimlari.'],
      ['semi-industrial', 'Ofis, do‘kon va zallar', 'Yuqori yuklama va katta maydonli obyektlar uchun unumdor uskunalar.'],
      ['multisplit', 'Bir nechta xona', 'Bitta tashqi agregatga ulanadigan turli ichki bloklar, jumladan Mini VRF Atom.'],
      ['vrf', 'Loyiha obyektlari', 'Mehmonxona, biznes markazi, klinika va ko‘p funksiyali binolar uchun kengaytiriladigan yechimlar.'],
      ['industrial', 'Muhandislik infratuzilmasi', 'Yirik obyektlar uchun chillerlar, fankoyllar, kompressor-kondensator bloklari va ruftoplar.']
    ],
    en: [
      ['household', 'Home and small business', 'Wall-mounted, cassette, ducted, and console solutions for apartments, houses, offices, and small commercial spaces.'],
      ['heat-pumps', 'Heating and cooling', 'Energy-efficient air-to-air and air-to-water systems for year-round indoor comfort.'],
      ['semi-industrial', 'Offices, shops, and halls', 'High-performance equipment for large spaces and facilities with increased loads.'],
      ['multisplit', 'Multiple rooms', 'Different indoor-unit types connected to one outdoor assembly, including Mini VRF Atom.'],
      ['vrf', 'Project facilities', 'Scalable solutions for hotels, business centers, clinics, and multi-purpose buildings.'],
      ['industrial', 'Engineering infrastructure', 'Chillers, fan coils, condensing units, and rooftops for large facilities.']
    ]
  }[language] || [];

  const groupMeta = {};
  localizedOrder.forEach((name, index) => {
    const meta = localizedMeta[index] || [`group-${index + 1}`, name, ''];
    groupMeta[name] = { id: meta[0], label: meta[1], text: meta[2] };
  });

  const groups = {};
  items.forEach((item) => ((groups[item.group] ||= []).push(item)));
  const orderedGroups = localizedOrder.filter((name) => groups[name]);

  const help = language === 'uz'
    ? { eyebrow: 'Nimadan boshlashni bilmayapsizmi?', title: 'Reja va vazifaga mos tizim tanlaymiz.', text: 'Maydon, obyekt vazifasi va xonalar sonini ayting. Yuko Global menejeri mos uskuna toifasini taklif qiladi va faqat zarur bo‘lsa texnik ma’lumotlarni so‘raydi.', button: 'Maslahat olish', message: 'Assalomu alaykum! Obyekt uchun iqlim tizimini tanlashda yordam kerak.' }
    : language === 'en'
      ? { eyebrow: 'Not sure where to start?', title: 'We will select a system for your layout and requirements.', text: 'Tell us the area, facility purpose, and number of rooms. A Yuko Global manager will recommend the right equipment class and request technical data only when needed.', button: 'Get a consultation', message: 'Hello! I need help selecting a climate system for a facility.' }
      : { eyebrow: 'Не знаете, с чего начать?', title: 'Подберём систему под планировку и задачу.', text: 'Сообщите площадь, назначение объекта и количество помещений. Менеджер Yuko Global предложит подходящий класс оборудования и запросит технические данные только при необходимости.', button: 'Получить консультацию', message: 'Здравствуйте! Нужна помощь с подбором климатической системы для объекта.' };

  root.innerHTML = `
    <div class="systems-jump" data-reveal>
      ${orderedGroups.map((name) => {
        const meta = groupMeta[name];
        return `<a href="#${meta.id}"><span>${window.YUKO.escape(meta.label)}</span><b>${groups[name].length}</b></a>`;
      }).join('')}
    </div>
    ${orderedGroups.map((groupName, groupIndex) => {
      const groupItems = groups[groupName];
      const meta = groupMeta[groupName];
      const allBrands = [...new Set(groupItems.flatMap((item) => item.brands || []))];
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
            ${groupItems.map((item, index) => `
              <article class="system-card">
                <a class="system-card__visual" href="${window.YUKO.withLanguage(`system-detail.html?id=${encodeURIComponent(item.id)}`)}">
                  <img src="assets/images/${item.image}" alt="${window.YUKO.escape(item.title)}" loading="lazy">
                  <span class="system-card__index">${String(index + 1).padStart(2, '0')}</span>
                </a>
                <div class="system-card__body">
                  <div class="system-card__brands">${(item.brands || []).map((brand) => `<span>${window.YUKO.escape(brand)}</span>`).join('')}</div>
                  <h3><a href="${window.YUKO.withLanguage(`system-detail.html?id=${encodeURIComponent(item.id)}`)}">${window.YUKO.escape(item.title)}</a></h3>
                  <p>${window.YUKO.escape(item.description)}</p>
                  <a class="system-card__link" href="${window.YUKO.withLanguage(`system-detail.html?id=${encodeURIComponent(item.id)}`)}">${window.YUKO.escape(t('Подробнее'))} <span>↗</span></a>
                </div>
              </article>`).join('')}
          </div>
        </section>`;
    }).join('')}
    <section class="systems-help" data-reveal>
      <div><span class="eyebrow">${window.YUKO.escape(help.eyebrow)}</span><h2>${window.YUKO.escape(help.title)}</h2><p>${window.YUKO.escape(help.text)}</p></div>
      <a class="button button--light" data-whatsapp data-message="${window.YUKO.escape(help.message)}" href="#">${window.YUKO.escape(help.button)}</a>
    </section>`;

  window.YUKO.applyWhatsAppLinks(root);
  requestAnimationFrame(() => root.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-visible')));
  };
  (window.YUKO_READY || Promise.resolve()).then(run);
})();
