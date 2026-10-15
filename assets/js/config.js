/* =====================================================================
   DevMediaWorx — SITE CONFIG
   Every editable value lives here. Change it once, it updates on every page.
   ===================================================================== */
window.CONFIG = {
  siteName: 'DevMediaWorx',
  siteUrl: 'https://devmediaworx.com',        // used for canonical / OG tags

  contact: {
    whatsapp: '201222243852',                  // international format, no + or spaces
    whatsappDisplay: '+20 122 224 3852',
    phone: '+201222243852',
    phoneDisplay: '+20 122 224 3852',
    email: 'hello@devmediaworx.com',
    address: '12 Boutros Ghali St., Roxy, Heliopolis, Cairo, Egypt',
    hours: 'Sunday – Thursday, 10:00 – 18:00 (GMT+3)', // TODO: confirm
    mapLink: 'https://maps.app.goo.gl/G1YZ1F2vzGe3bzKj9',
    mapEmbed: 'https://www.google.com/maps?q=30.0928966,31.3207923&z=17&output=embed'
  },

  // Leave a value empty ('') to turn that link off.
  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
    behance: ''
  },

  // Each tag loads ONLY when its ID is filled in. Empty = no errors, nothing loaded.
  tracking: {
    gtmId: '',            // GTM-XXXXXXX
    ga4Id: '',            // G-XXXXXXXXXX
    metaPixelId: '',      // 000000000000000
    googleAdsId: '',      // AW-XXXXXXXXXX
    adsLeadLabel: '',     // conversion label for form leads
    adsWhatsappLabel: '', // optional: separate label for WhatsApp clicks
    adsPhoneLabel: '',    // optional: separate label for phone clicks
    tiktokPixelId: ''
  },

  // Where the contact form goes. 'whatsapp' opens WhatsApp with the message pre-filled.
  // To use an email service instead, set mode: 'endpoint' and paste e.g. a Formspree URL.
  form: {
    mode: 'whatsapp',     // 'whatsapp' | 'endpoint'
    endpoint: ''          // e.g. 'https://formspree.io/f/xxxxxxx'
  }
};
