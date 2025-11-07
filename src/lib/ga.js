export const GA_ID = 'G-46BNDCHH88';

export function initGA() {
  if (window.__gaInit || !GA_ID) return;
  window.__gaInit = true;

  // Leggi preferenza salvata (default: ON per traffico USA)
  const analyticsGranted = localStorage.getItem('consent.analytics') !== 'denied';
  window[`ga-disable-${GA_ID}`] = !analyticsGranted;

  // Carica gtag
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };

  // Consent Mode (solo analytics)
  window.gtag('consent', 'default', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: 'denied',            // niente ads/signals
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: true,
    allow_google_signals: false
  });
}

export const updateAnalyticsConsent = (granted) => {
  localStorage.setItem('consent.analytics', granted ? 'granted' : 'denied');
  window[`ga-disable-${GA_ID}`] = !granted;
  window.gtag?.('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
};

export function trackPageview(path) {
  if (!window.gtag || !GA_ID) return;
  window.gtag("config", GA_ID, {
    page_path: path,
  });
}