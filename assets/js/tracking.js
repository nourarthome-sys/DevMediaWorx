/* =====================================================================
   DevMediaWorx — TRACKING
   GTM · GA4 · Meta Pixel · Google Ads · TikTok Pixel
   Google Consent Mode v2 · UTM / click-ID attribution · scroll depth

   EVENT NAMES (create matching GTM triggers on these dataLayer events):
     generate_lead      form submitted            Meta: Lead     Ads: conversion (adsLeadLabel)
     whatsapp_click     any WhatsApp link         Meta: Contact  Ads: conversion (adsWhatsappLabel, optional)
     phone_click        any tel: link             Meta: Contact  Ads: conversion (adsPhoneLabel, optional)
     email_click        any mailto: link
     directions_click   "Get directions" button
     cta_click          buttons with data-cta     params: label, section
     social_click       social icons              params: network
     service_view       a service tab/accordion is opened   params: service
     portfolio_view     a portfolio filter or slide is viewed  params: item
     video_play         any <video> starts playing
     language_switch    reserved for a future AR/EN toggle
     scroll_depth       25 / 50 / 75 / 90 %       params: percent
   Every event also carries: page, utm_source, utm_medium, utm_campaign (when present).
   ===================================================================== */
(function () {
  var C = (window.CONFIG && window.CONFIG.tracking) || {};
  var CONSENT_KEY = 'dmw_consent';
  var ATTR_KEY = 'dmw_attr';

  /* ---------- dataLayer + gtag stub (always present, so calls never throw) ---------- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };

  /* ---------- Consent Mode v2: default denied ---------- */
  var stored = null;
  try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) {}
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });
  if (stored === 'granted') grantConsent(false);

  function grantConsent(save) {
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
    if (window.fbq) fbq('consent', 'grant');
    if (save) try { localStorage.setItem(CONSENT_KEY, 'granted'); } catch (e) {}
  }

  function loadScript(src) {
    var s = document.createElement('script'); s.async = true; s.src = src;
    document.head.appendChild(s); return s;
  }

  /* ---------- Google Tag Manager ---------- */
  if (C.gtmId) {
    dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    loadScript('https://www.googletagmanager.com/gtm.js?id=' + C.gtmId);
    document.addEventListener('DOMContentLoaded', function () {
      var ns = document.createElement('noscript');
      ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' + C.gtmId + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
      document.body.insertBefore(ns, document.body.firstChild);
    });
  }

  /* ---------- GA4 + Google Ads (gtag.js) ---------- */
  var gtagId = C.ga4Id || C.googleAdsId;
  if (gtagId) {
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + gtagId);
    gtag('js', new Date());
    if (C.ga4Id) gtag('config', C.ga4Id);
    if (C.googleAdsId) gtag('config', C.googleAdsId); // remarketing
  }

  /* ---------- Meta Pixel ---------- */
  if (C.metaPixelId) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    if (stored !== 'granted') fbq('consent', 'revoke');
    fbq('init', C.metaPixelId);
    fbq('track', 'PageView');
  }

  /* ---------- TikTok Pixel ---------- */
  if (C.tiktokPixelId) {
    !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"]; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.load = function (e) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._u = r; var o = d.createElement("script"); o.type = "text/javascript"; o.async = !0; o.src = r + "?sdkid=" + e + "&lib=" + t; var a = d.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a) }; ttq.load(C.tiktokPixelId); ttq.page(); }(window, document, 'ttq');
  }

  /* ---------- Attribution: UTM + click IDs, kept for the session ---------- */
  var attr = {};
  try { attr = JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}'); } catch (e) {}
  try {
    var q = new URLSearchParams(location.search), found = false;
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'ttclid'].forEach(function (k) {
      if (q.get(k)) { attr[k] = q.get(k); found = true; }
    });
    if (found) attr.landing_page = location.pathname;
    if (!attr.referrer && document.referrer && document.referrer.indexOf(location.host) === -1) attr.referrer = document.referrer;
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch (e) {}

  /* ---------- Central track() helper ---------- */
  var META_MAP = { generate_lead: 'Lead', whatsapp_click: 'Contact', phone_click: 'Contact' };
  var TT_MAP = { generate_lead: 'SubmitForm', whatsapp_click: 'Contact', phone_click: 'Contact' };
  var ADS_MAP = { generate_lead: 'adsLeadLabel', whatsapp_click: 'adsWhatsappLabel', phone_click: 'adsPhoneLabel' };

  function track(name, params) {
    params = Object.assign({
      page: location.pathname,
      utm_source: attr.utm_source, utm_medium: attr.utm_medium, utm_campaign: attr.utm_campaign
    }, params || {});
    Object.keys(params).forEach(function (k) { if (params[k] === undefined) delete params[k]; });
    try { dataLayer.push(Object.assign({ event: name }, params)); } catch (e) {}
    try { if (C.ga4Id) gtag('event', name, params); } catch (e) {}
    try { if (C.googleAdsId && ADS_MAP[name] && C[ADS_MAP[name]]) gtag('event', 'conversion', { send_to: C.googleAdsId + '/' + C[ADS_MAP[name]] }); } catch (e) {}
    try { if (window.fbq && C.metaPixelId) { META_MAP[name] ? fbq('track', META_MAP[name], params) : fbq('trackCustom', name, params); } } catch (e) {}
    try { if (window.ttq && C.tiktokPixelId && TT_MAP[name]) ttq.track(TT_MAP[name], params); } catch (e) {}
  }

  window.DMW = window.DMW || {};
  window.DMW.track = track;
  window.DMW.attribution = function () { return Object.assign({}, attr); };
  window.DMW.sourceLabel = function () {
    if (attr.utm_source) return attr.utm_source + (attr.utm_campaign ? ' / ' + attr.utm_campaign : '');
    if (attr.gclid) return 'Google Ads';
    if (attr.fbclid) return 'Meta';
    if (attr.ttclid) return 'TikTok';
    return '';
  };

  /* ---------- Delegated click tracking ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a, button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var sec = a.closest('[data-section]');
    var where = a.dataset.section || (sec && sec.dataset.section) || 'unknown';
    if (/wa\.me|whatsapp/.test(href)) track('whatsapp_click', { location: where });
    else if (href.indexOf('tel:') === 0) track('phone_click', { location: where });
    else if (href.indexOf('mailto:') === 0) track('email_click', { location: where });
    if (a.dataset.directions !== undefined) track('directions_click', { location: where });
    if (a.dataset.social) track('social_click', { network: a.dataset.social });
    if (a.dataset.cta) track('cta_click', { label: a.dataset.cta, section: where });
  }, true);

  /* ---------- Video plays ---------- */
  document.addEventListener('play', function (e) {
    if (e.target.tagName === 'VIDEO') track('video_play', { video: e.target.currentSrc || e.target.dataset.name || 'video' });
  }, true);

  /* ---------- Scroll depth ---------- */
  var marks = [25, 50, 75, 90], hit = {};
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (h <= 0) return;
    var p = (scrollY / h) * 100;
    marks.forEach(function (m) { if (p >= m && !hit[m]) { hit[m] = 1; track('scroll_depth', { percent: m }); } });
  }, { passive: true });

  /* ---------- Consent banner ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (stored === 'granted' || stored === 'denied') return;
    var b = document.createElement('div');
    b.className = 'consent';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie preferences');
    b.innerHTML = '<p>We use cookies to measure visits and improve our ads. You can accept or keep only essential cookies.</p>' +
      '<div class="consent-actions"><button type="button" class="btn btn-ghost btn-sm" data-c="denied">Essential only</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-c="granted">Accept all</button></div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add('is-in'); });
    b.addEventListener('click', function (e) {
      var v = e.target.dataset && e.target.dataset.c;
      if (!v) return;
      if (v === 'granted') grantConsent(true);
      else try { localStorage.setItem(CONSENT_KEY, 'denied'); } catch (e2) {}
      b.classList.remove('is-in');
      setTimeout(function () { b.remove(); }, 500);
    });
  });
})();
