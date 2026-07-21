(function () {
  const STORAGE_KEY = 'yuko-language';
  const supported = ['ru', 'uz', 'en'];
  const rootPrefix = document.body.dataset.root || '';
  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  let savedLanguage = null;
  try { savedLanguage = localStorage.getItem(STORAGE_KEY); } catch (error) { savedLanguage = null; }
  const language = supported.includes(queryLanguage) ? queryLanguage : (supported.includes(savedLanguage) ? savedLanguage : 'ru');

  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function injectLanguageSwitcher() {
    if (document.querySelector('[data-language-switcher]')) return;
    const actions = document.querySelector('.header-actions');
    if (!actions) return;
    const labels = { ru: 'Выбор языка', uz: 'Tilni tanlash', en: 'Choose language' };
    const wrap = document.createElement('div');
    wrap.className = 'language-switcher';
    wrap.dataset.languageSwitcher = '';
    wrap.setAttribute('aria-label', labels[language]);
    wrap.innerHTML = supported.map((code) => `<button type="button" data-language="${code}" class="${code === language ? 'is-active' : ''}" aria-pressed="${code === language}">${code.toUpperCase()}</button>`).join('');
    const phone = actions.querySelector('.header-phone');
    actions.insertBefore(wrap, phone || actions.firstChild);
    wrap.addEventListener('click', (event) => {
      const button = event.target.closest('[data-language]');
      if (!button) return;
      const next = button.dataset.language;
      if (!supported.includes(next) || next === language) return;
      try { localStorage.setItem(STORAGE_KEY, next); } catch (error) { /* storage can be disabled */ }
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      window.location.href = url.toString();
    });
    const style = document.createElement('style');
    style.textContent = `.language-switcher{display:inline-flex;align-items:center;padding:3px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.025);gap:2px;flex:0 0 auto}.language-switcher button{width:34px;height:32px;padding:0;border:0;border-radius:999px;background:transparent;color:#8f8f94;font-size:10px;font-weight:800;letter-spacing:.08em;cursor:pointer;transition:.2s ease}.language-switcher button:hover{color:#fff;background:rgba(255,255,255,.07)}.language-switcher button.is-active{color:#080808;background:#f1f1ed}@media(max-width:1120px){.header-phone{display:none}.nav{gap:18px}}@media(max-width:860px){.language-switcher{margin-left:auto}.header-actions{gap:7px}}@media(max-width:430px){.logo-copy strong{font-size:13px}.logo-mark{width:34px;height:34px}.language-switcher button{width:30px;height:29px;font-size:9px}}`;
    document.head.appendChild(style);
  }

  injectLanguageSwitcher();

  function initialize() {
    const dictionary = window.YUKO_I18N_DICTIONARY || {};
    const common = window.YUKO_I18N_COMMON || {};
    const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

    function t(value) {
      if (language === 'ru' || value == null) return value;
      const original = String(value);
      const normalized = normalize(original);
      const exact = dictionary[normalized];
      if (exact) return original.replace(normalized, exact);
      const upTo = normalized.match(/^до\s+(.+)$/i);
      if (upTo) return language === 'uz' ? `${upTo[1]} gacha` : `up to ${upTo[1]}`;
      const from = normalized.match(/^от\s+(.+)$/i);
      if (from) return language === 'uz' ? `${from[1]} dan` : `from ${from[1]}`;
      return original;
    }

    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();
    const translatableAttributes = ['placeholder', 'aria-label', 'title', 'alt', 'content', 'data-message'];

    function translateNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.parentElement || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.parentElement.tagName)) return;
        if (!originalText.has(node)) originalText.set(node, node.nodeValue);
        const original = originalText.get(node);
        const trimmed = normalize(original);
        if (!trimmed) return;
        node.nodeValue = original.replace(trimmed, t(trimmed));
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      let attrs = originalAttributes.get(node);
      if (!attrs) { attrs = {}; originalAttributes.set(node, attrs); }
      translatableAttributes.forEach((attribute) => {
        if (!node.hasAttribute(attribute)) return;
        if (!(attribute in attrs)) attrs[attribute] = node.getAttribute(attribute);
        node.setAttribute(attribute, t(attrs[attribute]));
      });
    }

    function translateTree(root = document.body) {
      if (!root) return;
      translateNode(root);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) translateNode(node);
    }

    function withLanguage(rawHref) {
      if (language === 'ru' || !rawHref) return rawHref;
      try {
        const target = new URL(rawHref, document.baseURI || window.location.href);
        target.searchParams.set('lang', language);
        if (!rawHref.startsWith('/') && !/^[a-z][a-z0-9+.-]*:/i.test(rawHref)) {
          const path = rawHref.split(/[?#]/, 1)[0];
          return `${path}${target.search}${target.hash}`;
        }
        return target.toString();
      } catch (error) {
        return `${rawHref}${rawHref.includes('?') ? '&' : '?'}lang=${language}`;
      }
    }

    function applyLanguageToLinks(root = document) {
      if (language === 'ru' || !root?.querySelectorAll) return;
      const links = [...root.querySelectorAll('a[href]')];
      if (root.matches?.('a[href]')) links.unshift(root);
      links.forEach((link) => {
        const rawHref = link.getAttribute('href');
        if (!rawHref || rawHref.startsWith('#') || /^(tel:|mailto:|https?:|javascript:)/i.test(rawHref)) return;
        if (!/\.html(?:[?#]|$)/i.test(rawHref)) return;
        link.setAttribute('href', withLanguage(rawHref));
      });
    }

    function localizeTechnical(value) {
      if (language === 'ru' || value == null || typeof value !== 'string') return value;
      const badgeMap = language === 'uz'
        ? { 'Хит': 'Xit', 'Выгодно': 'Qulay narx', 'Популярный': 'Ommabop' }
        : { 'Хит': 'Best seller', 'Выгодно': 'Best value', 'Популярный': 'Popular' };
      if (badgeMap[value]) return badgeMap[value];
      let result = value.replace(/кВт/gi, 'kW').replace(/дБ/gi, 'dB').replace(/м³\/ч/gi, 'm³/h').replace(/м²/gi, 'm²').replace(/мм/gi, 'mm').replace(/(^|\s)м(?=($|\s|[,.;]))/gi, '$1m');
      const from = result.match(/^от\s+(.+)$/i);
      if (from) return language === 'uz' ? `${from[1]} dan` : `from ${from[1]}`;
      const upTo = result.match(/^до\s+(.+)$/i);
      if (upTo) return language === 'uz' ? `${upTo[1]} gacha` : `up to ${upTo[1]}`;
      return result;
    }

    function localizeSystem(item) {
      if (!item || language === 'ru') return item;
      const translated = common.systemTranslations?.[item.id];
      const groupName = common.systemGroups?.[item.group]?.[language] || t(item.group);
      const preset = common.groupPresets?.[item.group]?.[language];
      if (!translated) return { ...item, group: groupName };
      return {
        ...item,
        title: translated[language === 'uz' ? 0 : 1],
        group: groupName,
        description: translated[language === 'uz' ? 2 : 3],
        applications: preset?.applications || item.applications,
        benefits: preset?.benefits || item.benefits,
        note: preset?.note || item.note,
        modelsNote: preset?.modelsNote || item.modelsNote
      };
    }

    function localizeProduct(item) {
      if (!item || language === 'ru') return item;
      const category = item.category || 'inverter';
      const description = common.productDescriptions?.[item.id]?.[language === 'uz' ? 0 : 1] || t(item.description);
      const localized = {
        ...item,
        type: common.productTypes?.[category]?.[language] || t(item.type),
        description,
        features: common.productPresets?.[category]?.[language] || item.features
      };
      ['badge', 'cooling', 'heating', 'noise', 'powerCooling', 'airFlow', 'pipe', 'height', 'coolingRange', 'heatingRange', 'indoorSize', 'outdoorSize'].forEach((key) => { localized[key] = localizeTechnical(localized[key]); });
      return localized;
    }

    function applyWhatsAppLinks(root = document) {
      root.querySelectorAll?.('[data-whatsapp]').forEach((link) => {
        const message = link.dataset.message || t('Здравствуйте! Хочу подобрать кондиционер в Yuko Global.');
        link.href = `https://wa.me/998875010999?text=${encodeURIComponent(message)}`;
        link.target = '_blank';
        link.rel = 'noopener';
      });
    }

    window.YUKO_I18N = { language, t, localizeSystem, localizeProduct, translateTree };
    window.YUKO = {
      rootPrefix, language, t, localizeSystem, localizeProduct, applyWhatsAppLinks, withLanguage,
      productUrl(product) { return withLanguage(`${rootPrefix}products/${product.id}.html`); },
      imageUrl(product) { return `${rootPrefix}assets/images/${product.image}`; },
      escape(value) { const div = document.createElement('div'); div.textContent = value; return div.innerHTML; }
    };

    translateTree(document.documentElement);
    applyLanguageToLinks(document);
    applyWhatsAppLinks(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.TEXT_NODE) return;
        translateTree(node);
        const root = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        applyLanguageToLinks(root);
        applyWhatsAppLinks(root);
      }));
    });
    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

    const menuButton = document.querySelector('[data-menu-button]');
    const nav = document.querySelector('[data-nav]');
    if (menuButton && nav) {
      menuButton.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
      });
    }

    document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
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
        const name = data.get('name') || t('Клиент');
        const phone = data.get('phone') || t('не указан');
        const area = data.get('area') || t('не указана');
        const message = language === 'uz'
          ? `Assalomu alaykum! Mening ismim ${name}. Konditsioner tanlash kerak. Maydon: ${area} m². Telefon: ${phone}.`
          : language === 'en'
            ? `Hello! My name is ${name}. I need help selecting an air conditioner. Area: ${area} m². Phone: ${phone}.`
            : `Здравствуйте! Меня зовут ${name}. Нужен подбор кондиционера. Площадь: ${area} м². Телефон: ${phone}.`;
        window.open(`https://wa.me/998875010999?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      });
    }

    const revealNodes = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.12 });
      revealNodes.forEach((node) => observer.observe(node));
    } else { revealNodes.forEach((node) => node.classList.add('is-visible')); }
  }

  const dataReady = language === 'ru'
    ? Promise.resolve()
    : Promise.all([
        loadScript(`${rootPrefix}assets/js/i18n-common.js`),
        loadScript(`${rootPrefix}assets/js/i18n-${language}.js`)
      ]).then(() => window.YUKO_I18N_DICTIONARY_READY);

  window.YUKO_READY = dataReady.then(initialize).catch((error) => {
    console.error('[Yuko Global] Language pack failed to load:', error);
    window.YUKO_I18N_DICTIONARY = {};
    window.YUKO_I18N_COMMON = {};
    initialize();
  });
})();
