/* =====================================================================
   DevMediaWorx — MOTION SYSTEM
   GSAP + ScrollTrigger + SplitText + CustomEase + Observer, Lenis smooth scroll.

   Declarative: add data-anim="..." to any element.
     chars | words | lines   split heading reveal (chars for English only)
     rise                    up 40px from blur
     flip                    rotate in on Y axis
     stagger                 children enter one after another
     count                   number counts to data-count (optional data-suffix)
     draw                    SVG paths draw themselves
     wipe                    clip-path reveal
     scale | zoom            scale into place from blur
     line                    .u-line underline grows
   Optional: data-delay="0.2"  data-dur="1.4"
   Extras: data-parallax="0.15" on images, data-accent on sections,
           .magnetic buttons, .card spotlight + tilt, scroll progress bar,
           intro curtain, custom cursor, particles.
   ===================================================================== */
(function () {
  var html = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var g = window.gsap;

  /* Without GSAP or with reduced motion: show everything, skip the curtain */
  if (!g || reduce) {
    html.classList.add('no-curtain');
    var p = document.querySelector('.progress');
    if (p) window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      p.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    }, { passive: true });
    return;
  }

  g.registerPlugin(ScrollTrigger, SplitText, CustomEase, Observer);
  CustomEase.create('expo', 'M0,0 C0.16,1 0.3,1 1,1');
  g.defaults({ ease: 'expo', duration: 1.2 });

  /* ---------- Lenis smooth scroll, synced with ScrollTrigger ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.2 });
    lenis.on('scroll', ScrollTrigger.update);
    g.ticker.add(function (t) { lenis.raf(t * 1000); });
    g.ticker.lagSmoothing(0);
    window.DMW.lenis = lenis;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return;
        var t = document.querySelector(id); if (!t) return;
        e.preventDefault(); lenis.scrollTo(t, { offset: -90 });
      });
    });
  }

  /* ---------- Scroll progress ---------- */
  g.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* ---------- data-anim system ---------- */
  function opts(el) { return { delay: parseFloat(el.dataset.delay || 0), duration: parseFloat(el.dataset.dur || 1.2) }; }
  function st(el) { return { trigger: el, start: 'top 85%', once: true }; }

  var builders = {
    chars: function (el, o) { return split(el, 'chars', o, .022); },
    words: function (el, o) { return split(el, 'words', o, .06); },
    lines: function (el, o) { return split(el, 'lines', o, .1); },
    rise: function (el, o) { return g.from(el, { y: 40, opacity: 0, filter: 'blur(6px)', delay: o.delay, duration: o.duration, scrollTrigger: st(el) }); },
    flip: function (el, o) {
      g.set(el.parentElement, { perspective: 1200 });
      return g.from(el, { rotateY: -35, opacity: 0, transformOrigin: 'left center', delay: o.delay, duration: o.duration, scrollTrigger: st(el) });
    },
    stagger: function (el, o) { return g.from(el.children, { y: 40, opacity: 0, filter: 'blur(6px)', stagger: .09, delay: o.delay, duration: o.duration, scrollTrigger: st(el) }); },
    count: function (el, o) {
      var end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', obj = { v: 0 };
      el.textContent = '0' + suf;
      return g.to(obj, { v: end, duration: o.duration + .6, delay: o.delay, ease: 'expo', scrollTrigger: st(el),
        onUpdate: function () { el.textContent = Math.round(obj.v) + suf; } });
    },
    draw: function (el, o) {
      var paths = el.querySelectorAll('path, line, polyline, circle');
      paths.forEach(function (p) { var l = p.getTotalLength ? p.getTotalLength() : 300; p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
      return g.to(paths, { strokeDashoffset: 0, duration: o.duration + .4, stagger: .1, delay: o.delay, scrollTrigger: st(el) });
    },
    wipe: function (el, o) { return g.fromTo(el, { clipPath: 'inset(0 100% 0 0 round 26px)' }, { clipPath: 'inset(0 0% 0 0 round 26px)', duration: o.duration + .4, delay: o.delay, scrollTrigger: st(el) }); },
    scale: function (el, o) { return g.from(el, { scale: .9, opacity: 0, filter: 'blur(10px)', delay: o.delay, duration: o.duration + .2, scrollTrigger: st(el) }); },
    line: function (el, o) {
      var t = el.matches('.u-line') ? [el] : el.querySelectorAll('.u-line');
      return g.fromTo(t, { '--line-s': 0 }, { '--line-s': 1, duration: o.duration, delay: o.delay + .3, scrollTrigger: st(el) });
    }
  };
  builders.zoom = builders.scale;

  function split(el, type, o, each) {
    var s = new SplitText(el, { type: type === 'lines' ? 'lines' : 'lines,' + type, mask: 'lines', linesClass: 'split-line', wordsClass: 'split-word', charsClass: 'split-char' });
    var targets = s[type];
    return g.from(targets, { yPercent: 115, rotateX: type === 'chars' ? -40 : 0, opacity: 0, stagger: each, delay: o.delay, duration: o.duration, transformOrigin: '50% 100%', scrollTrigger: st(el) });
  }

  function runAnims(scope) {
    (scope || document).querySelectorAll('[data-anim]').forEach(function (el) {
      if (el._anim) return; el._anim = 1;
      el.dataset.anim.split(' ').forEach(function (type) { if (builders[type]) builders[type](el, opts(el)); });
    });
  }

  /* ---------- Parallax ---------- */
  function parallax() {
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.dataset.parallax || .12);
      g.fromTo(el, { yPercent: -amt * 60 }, { yPercent: amt * 60, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- Process timeline rail draws with scroll ---------- */
  function rail() {
    var r = document.querySelector('.timeline .rail'); if (!r) return;
    g.to(r, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: .4 } });
    document.querySelectorAll('.t-dot').forEach(function (d) {
      ScrollTrigger.create({ trigger: d, start: 'top 70%', onEnter: function () { g.to(d, { borderColor: '#14B8F0', backgroundColor: '#0D1536', duration: .6 }); },
        onLeaveBack: function () { g.to(d, { borderColor: '#2B3A78', backgroundColor: '#050918', duration: .6 }); } });
    });
  }

  /* ---------- Accent tween per section (data-accent="cyan|violet|blue") ---------- */
  var ACCENTS = { cyan: ['#14B8F0', '#7B3BFF'], violet: ['#9B6BFF', '#14B8F0'], blue: ['#4F7BFF', '#14B8F0'], warm: ['#FF8A5B', '#7B3BFF'] };
  function accents() {
    document.querySelectorAll('[data-accent]').forEach(function (sec) {
      var a = ACCENTS[sec.dataset.accent]; if (!a) return;
      ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 45%',
        onToggle: function (self) { if (self.isActive) g.to(html, { '--acc': a[0], '--acc-2': a[1], duration: 1.4, ease: 'power2.out' }); } });
    });
  }

  /* ---------- Rolling timecode in the hero card ---------- */
  var tc = document.querySelector('[data-timecode]');
  if (tc) {
    var f = 0;
    g.ticker.add(function () {
      f++; var fr = f % 25, s = Math.floor(f / 25), pad = function (n) { return (n < 10 ? '0' : '') + n; };
      tc.textContent = '00:' + pad(Math.floor(s / 60) % 60) + ':' + pad(s % 60) + ':' + pad(fr);
    });
  }

  /* ---------- Pointer interactions (fine pointer only) ---------- */
  function pointer() {
    if (!fine) return;
    var cur = document.querySelector('.cursor');
    if (cur) {
      var xTo = g.quickTo(cur, 'x', { duration: .35, ease: 'power3' }), yTo = g.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
      window.addEventListener('mousemove', function (e) { cur.classList.add('is-on'); xTo(e.clientX); yTo(e.clientY); });
      document.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); });
      document.addEventListener('mouseover', function (e) {
        cur.classList.toggle('is-hover', !!e.target.closest('a, button, .card, .case, [role="option"]'));
      });
    }
    document.querySelectorAll('.magnetic').forEach(function (b) {
      var bx = g.quickTo(b, 'x', { duration: .6, ease: 'power3' }), by = g.quickTo(b, 'y', { duration: .6, ease: 'power3' });
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        bx((e.clientX - r.left - r.width / 2) * .3); by((e.clientY - r.top - r.height / 2) * .4);
      });
      b.addEventListener('mouseleave', function () { g.to(b, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' }); });
    });
    document.querySelectorAll('.card, .tilt').forEach(function (c) {
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
        g.to(c, { rotateY: (px - .5) * 6, rotateX: (.5 - py) * 6, transformPerspective: 900, duration: .6, ease: 'power3' });
      });
      c.addEventListener('mouseleave', function () { g.to(c, { rotateX: 0, rotateY: 0, duration: 1, ease: 'expo' }); });
    });
  }

  /* ---------- Particles: fine drifting dust tinted with the accent ---------- */
  function particles() {
    var cv = document.getElementById('particles'); if (!cv || !fine) { if (cv) cv.remove(); return; }
    var ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2), W, H, pts = [], mx = 0, my = 0, running = true;
    function size() { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); addEventListener('resize', size);
    for (var i = 0; i < 70; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, vx: (Math.random() - .5) * .15, vy: -Math.random() * .25 - .05, d: Math.random() * .6 + .2 });
    addEventListener('mousemove', function (e) { mx = (e.clientX / W - .5); my = (e.clientY / H - .5); });
    document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) loop(); });
    function loop() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var col = getComputedStyle(html).getPropertyValue('--acc').trim() || '#14B8F0';
      ctx.fillStyle = col;
      pts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        ctx.globalAlpha = p.d * .55;
        ctx.beginPath(); ctx.arc(p.x - mx * 30 * p.d, p.y - my * 30 * p.d, p.r, 0, 6.283); ctx.fill();
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------- Intro curtain, then hero entrance ---------- */
  function heroIn() {
    var tl = g.timeline();
    var h1 = document.querySelector('[data-hero-title]');
    if (h1) {
      var s = new SplitText(h1, { type: 'lines,words', mask: 'lines', linesClass: 'split-line', wordsClass: 'split-word' });
      tl.from(s.words, { yPercent: 115, opacity: 0, stagger: .05, duration: 1.3 }, 0);
    }
    tl.from('[data-hero-item]', { y: 30, opacity: 0, filter: 'blur(6px)', stagger: .1, duration: 1.1 }, .35)
      .from('[data-hero-media]', { scale: 1.12, duration: 2.2, ease: 'expo' }, 0);
    return tl;
  }

  function start() {
    var seen = false;
    try { seen = sessionStorage.getItem('dmw_intro') === '1'; } catch (e) {}
    var curtain = document.querySelector('.curtain');
    if (seen || !curtain) {
      html.classList.add('no-curtain'); heroIn();
    } else {
      try { sessionStorage.setItem('dmw_intro', '1'); } catch (e) {}
      var tl = g.timeline({ onComplete: function () { html.classList.add('no-curtain'); } });
      tl.from('.curtain .mark img', { scale: .6, opacity: 0, duration: .9 })
        .from('.curtain .mark span', { opacity: 0, y: 10, duration: .6 }, '-=.5')
        .to('.curtain .mark', { opacity: 0, scale: .94, duration: .5 }, '+=.25')
        .to('.curtain .panel.top', { yPercent: -101, duration: 1.1 }, '-=.15')
        .to('.curtain .panel.bot', { yPercent: 101, duration: 1.1 }, '<')
        .add(heroIn(), '-=.9');
    }
    runAnims(); parallax(); rail(); accents(); pointer(); particles();
    ScrollTrigger.refresh();
  }

  /* Never wait more than 2.5s for fonts */
  var started = false;
  function go() { if (started) return; started = true; start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
  setTimeout(go, 2500);
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
