// Slider dos 4 cenários "Ainda em dúvida?" — carregado só em /criadores-e-audiovisual/.
(() => {
  const wrap = document.querySelector('[data-escolha-slider]');
  if (!wrap) return;
  const track = wrap;
  const cards = [...wrap.querySelectorAll('.escolha-card')];
  const prev = document.querySelector('[data-escolha-prev]');
  const next = document.querySelector('[data-escolha-next]');
  if (!cards.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduce ? 'auto' : 'smooth';
  const step = () => cards[0].getBoundingClientRect().width + 18;
  const max = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const go = (dir) => track.scrollBy({ left: dir * step(), behavior });
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  const sync = () => {
    const l = track.scrollLeft;
    if (prev) prev.disabled = l <= 2;
    if (next) next.disabled = l >= max() - 2;
  };
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  window.addEventListener('resize', sync);
  sync();
})();
