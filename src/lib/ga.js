// /src/lib/ga.js
export const GA_ID = 'G-46BNDCHH88'; // pubblico per natura, ok hard-coded

export function initGA() {
  if (window.__gaInit || !GA_ID) return;
  window.__gaInit = true;

  // 1) carica gtag.js
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  // 2) prepara dataLayer/gtag (safe anche se lo script non ha finito)
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };

  // 3) init + config
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    send_page_view: true,        // se usi React Router metti false e invia tu i page_view
    allow_google_signals: false, // opzionale: niente Signals/ads features
  });
}

// facoltativi se poi ti servono
export const pageview = (url) =>
  window.gtag?.('event', 'page_view', { page_location: url, page_title: document.title });

export const gaEvent = (name, params={}) =>
  window.gtag?.('event', name, params);
