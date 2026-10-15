/* =====================================================================
   DevMediaWorx — INTERFACE
   Header · mobile menu · service tabs/accordion · portfolio carousel &
   filters · FAQ · contact form (phone picker, dropdown, validation) ·
   world clocks · map
   ===================================================================== */
(function () {
  var C = window.CONFIG;
  var track = (window.DMW && window.DMW.track) || function () {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Header: solid after scroll, hides on scroll down ---------- */
  var header = $('.header'), lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    if (!document.documentElement.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', y > lastY && y > 300);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = $('.burger');
  function setMenu(open) {
    document.documentElement.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (window.DMW.lenis) open ? window.DMW.lenis.stop() : window.DMW.lenis.start();
    if (open && window.gsap) {
      gsap.fromTo('.mobile-menu nav a, .mobile-menu .mm-foot > *', { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: .8, stagger: .06, delay: .2, ease: 'expo' });
    }
  }
  burger.addEventListener('click', function () { setMenu(!document.documentElement.classList.contains('menu-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Services: tabs on desktop, accordion on mobile ---------- */
  var tabs = $('[data-tabs]');
  if (tabs) {
    var btns = $$('.tab-btn', tabs), panels = $$('.tab-panel', tabs);
    function select(id, fromUser) {
      btns.forEach(function (b) {
        var on = b.getAttribute('aria-controls') === id;
        b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) {
        var on = p.id === id;
        p.hidden = !on;
        p.classList.toggle('is-open', on);
        var h = $('.acc-head', p); if (h) h.setAttribute('aria-expanded', on);
        if (on && window.gsap && fromUser && innerWidth > 900) {
          gsap.fromTo(p.children, { opacity: 0, y: 24, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9, stagger: .08, ease: 'expo' });
        }
      });
      if (fromUser) track('service_view', { service: id });
      if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 520);
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b.getAttribute('aria-controls'), true); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return; e.preventDefault();
        var n = btns[(i + d + btns.length) % btns.length]; n.focus(); n.click();
      });
    });
    panels.forEach(function (p) {
      var h = $('.acc-head', p);
      if (h) h.addEventListener('click', function () {
        var open = !p.classList.contains('is-open');
        p.classList.toggle('is-open', open); h.setAttribute('aria-expanded', open);
        if (open) track('service_view', { service: p.id });
        if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 520);
      });
    });
    var initial = (location.hash || '').slice(1);
    select(panels.some(function (p) { return p.id === initial; }) ? initial : panels[0].id, false);
    if (initial && $('#' + initial)) setTimeout(function () { $('#' + initial).scrollIntoView({ block: 'start' }); }, 300);
  }

  /* ---------- Portfolio carousel (Swiper) ---------- */
  if (window.Swiper && $('.work-swiper')) {
    var sw = new Swiper('.work-swiper', {
      slidesPerView: 'auto', spaceBetween: 20, grabCursor: true, speed: 900,
      autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
      navigation: { nextEl: '.sw-next', prevEl: '.sw-prev' },
      pagination: { el: '.swiper-pagination', clickable: true },
      keyboard: { enabled: true }
    });
    sw.on('slideChange', function () {
      var s = sw.slides[sw.activeIndex];
      track('portfolio_view', { item: s && s.dataset.name });
    });
  }

  /* ---------- Portfolio filters (work page) ---------- */
  var fbtns = $$('.filters button'), cases = $$('.work-grid .case');
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.filter;
      fbtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      var show = cases.filter(function (c) { return f === 'all' || c.dataset.cat.split(' ').indexOf(f) > -1; });
      cases.forEach(function (c) { c.hidden = show.indexOf(c) === -1; });
      if (window.gsap) gsap.fromTo(show, { opacity: 0, y: 30, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .8, stagger: .06, ease: 'expo' });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      track('portfolio_view', { item: 'filter:' + f });
    });
  });

  /* ---------- FAQ ---------- */
  $$('.faq-item').forEach(function (it) {
    var q = $('.faq-q', it);
    q.addEventListener('click', function () {
      var open = !it.classList.contains('is-open');
      it.classList.toggle('is-open', open); q.setAttribute('aria-expanded', open);
      if (window.ScrollTrigger) setTimeout(function () { ScrollTrigger.refresh(); }, 520);
    });
  });

  /* ---------- World clocks ---------- */
  var clocks = $$('[data-tz]');
  function tick() {
    clocks.forEach(function (el) {
      try { el.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.tz }).format(new Date()); } catch (e) {}
    });
  }
  if (clocks.length) { tick(); setInterval(tick, 20000); }

  /* ---------- Map (lazy) ---------- */
  var map = $('[data-map]');
  if (map && C.contact.mapEmbed) {
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      var f = document.createElement('iframe');
      f.src = C.contact.mapEmbed; f.loading = 'lazy'; f.title = 'DevMediaWorx location map';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      map.appendChild(f); io.disconnect();
    }, { rootMargin: '200px' });
    io.observe(map);
  }

  /* ---------- Contact form ---------- */
  var form = $('#lead-form');
  if (!form) return;

  var COUNTRIES = [
    ['eg', 'Egypt', '+20'], ['ae', 'United Arab Emirates', '+971'], ['sa', 'Saudi Arabia', '+966'],
    ['kw', 'Kuwait', '+965'], ['qa', 'Qatar', '+974'], ['bh', 'Bahrain', '+973'], ['om', 'Oman', '+968'],
    ['gb', 'United Kingdom', '+44'], ['de', 'Germany', '+49'], ['fr', 'France', '+33'], ['it', 'Italy', '+39'],
    ['nl', 'Netherlands', '+31'], ['us', 'United States', '+1'], ['ca', 'Canada', '+1']
  ];
  var flag = function (code) { return '<span class="flag" style="background-image:url(assets/vendor/flags/' + code + '.svg)"></span>'; };

  /* Generic dropdown helper: button + listbox, keyboard support */
  function dropdown(btn, list, items, onPick) {
    var active = 0;
    list.innerHTML = items.map(function (it, i) {
      return '<li role="option" id="' + list.id + '-' + i + '" data-i="' + i + '" aria-selected="false">' + it.html + '</li>';
    }).join('');
    var lis = $$('li', list);
    function open(o) {
      list.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', o);
      if (o) { highlight(active); list.focus({ preventScroll: true }); }
    }
    function highlight(i) {
      active = (i + lis.length) % lis.length;
      lis.forEach(function (l, j) { l.classList.toggle('is-active', j === active); });
      list.setAttribute('aria-activedescendant', lis[active].id);
      lis[active].scrollIntoView({ block: 'nearest' });
    }
    function pick(i) {
      lis.forEach(function (l, j) { l.setAttribute('aria-selected', j === i); });
      active = i; onPick(items[i]); open(false); btn.focus();
    }
    btn.addEventListener('click', function () { open(!list.classList.contains('is-open')); });
    list.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) pick(+li.dataset.i); });
    list.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); highlight(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(active - 1); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active); }
      else if (e.key === 'Escape' || e.key === 'Tab') { open(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) { if (!btn.contains(e.target) && !list.contains(e.target)) open(false); });
    return { pick: pick };
  }

  /* Phone country code */
  var ccBtn = $('#cc-btn'), ccList = $('#cc-list'), ccInput = form.elements.country_code;
  dropdown(ccBtn, ccList, COUNTRIES.map(function (c) {
    return { value: c[2], code: c[0], html: flag(c[0]) + '<span>' + c[1] + '</span><span class="dial">' + c[2] + '</span>' };
  }), function (it) {
    ccBtn.innerHTML = flag(it.code) + '<span>' + it.value + '</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
    ccInput.value = it.value;
  }).pick(0);

  /* Service dropdown */
  var svBtn = $('#service-btn'), svList = $('#service-list'), svInput = form.elements.service;
  var SERVICES = ['Website', 'Mobile app', 'Business system', 'Video production', 'Marketing & ads', 'Event production', 'A mix of these'];
  var svDD = dropdown(svBtn, svList, SERVICES.map(function (s) { return { value: s, html: '<span>' + s + '</span>' }; }), function (it) {
    $('span', svBtn).textContent = it.value; svInput.value = it.value; clearErr('service');
  });
  var preset = new URLSearchParams(location.search).get('service');
  if (preset && SERVICES.indexOf(preset) > -1) svDD.pick(SERVICES.indexOf(preset));

  /* Attribution hidden fields */
  var attr = window.DMW.attribution ? window.DMW.attribution() : {};
  Object.keys(attr).forEach(function (k) {
    var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = attr[k]; form.appendChild(i);
  });

  function setErr(name, msg) {
    var f = form.querySelector('[data-field="' + name + '"]');
    if (!f) return; f.classList.add('has-error'); $('.err', f).textContent = msg;
  }
  function clearErr(name) {
    var f = form.querySelector('[data-field="' + name + '"]');
    if (f) { f.classList.remove('has-error'); $('.err', f).textContent = ''; }
  }
  ['name', 'email', 'phone', 'message'].forEach(function (n) {
    form.elements[n].addEventListener('input', function () { clearErr(n); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = {
      name: form.elements.name.value.trim(), email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.replace(/[^\d]/g, ''), cc: ccInput.value,
      company: form.elements.company.value.trim(), service: svInput.value,
      message: form.elements.message.value.trim()
    };
    var ok = true;
    if (v.name.length < 2) { setErr('name', 'Please enter your name.'); ok = false; }
    if (!/^\S+@\S+\.\S{2,}$/.test(v.email)) { setErr('email', 'Please enter a valid email address.'); ok = false; }
    if (v.phone.length < 7) { setErr('phone', 'Please enter a phone number we can reach you on.'); ok = false; }
    if (!v.service) { setErr('service', 'Please choose what you need.'); ok = false; }
    if (v.message.length < 10) { setErr('message', 'Tell us a little about the project (at least a sentence).'); ok = false; }
    if (!ok) { var first = $('.has-error input, .has-error textarea, .has-error button', form); if (first) first.focus(); return; }

    track('generate_lead', { service: v.service, country_code: v.cc });

    var src = window.DMW.sourceLabel ? window.DMW.sourceLabel() : '';
    var text = "Hi DevMediaWorx, I'm " + v.name + (v.company ? ' from ' + v.company : '') + '.\n' +
      'Service: ' + v.service + '\nPhone: ' + v.cc + ' ' + v.phone + '\nEmail: ' + v.email + '\n\n' + v.message +
      (src ? '\n\n(Source: ' + src + ')' : '');

    function success() {
      var s = $('.form-success');
      $('[data-success-name]', s).textContent = v.name.split(' ')[0];
      s.classList.add('is-in');
      if (window.gsap) {
        gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: .5 });
        gsap.fromTo(s.querySelectorAll('circle, path'), { strokeDashoffset: 280 }, { strokeDashoffset: 0, duration: 1.2, stagger: .2, ease: 'expo' });
        gsap.fromTo(s.querySelectorAll('h3, p, .btn'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, delay: .4, duration: .8, ease: 'expo' });
      }
    }

    if (C.form.mode === 'endpoint' && C.form.endpoint) {
      var fd = new FormData(form); fd.set('phone', v.cc + ' ' + v.phone);
      fetch(C.form.endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw 0; success(); form.reset(); })
        .catch(function () { setErr('message', 'Sending failed. Please try again or message us on WhatsApp.'); });
    } else {
      $('.form-success [data-wa-final]').href = 'https://wa.me/' + C.contact.whatsapp + '?text=' + encodeURIComponent(text);
      success();
    }
  });
})();
