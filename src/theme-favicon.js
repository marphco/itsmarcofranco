(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  function setFavicon() {
    const href = mq.matches ? 'favicon-dark.svg' : 'favicon-light.svg';

    // rimuovi le icone esistenti
    document.querySelectorAll('link[rel="icon"]').forEach(n => n.remove());

    // aggiungi l'icona corretta (cache-busting per forzare l’update live)
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = `${href}?v=${mq.matches ? 'd' : 'l'}`;
    document.head.appendChild(link);
  }

  setFavicon();
  if (mq.addEventListener) mq.addEventListener('change', setFavicon);
  else if (mq.addListener) mq.addListener(setFavicon); // Safari vecchi
})();
