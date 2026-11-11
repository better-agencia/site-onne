// Slider de peças de reposição — carregado apenas em /acessorios/.
(() => {
  const root = document.querySelector('[data-pecas-slider]');
  if (!root) return;
  const track = root.querySelector('[data-slide-track]');
  const slides = [...root.querySelectorAll('.pecas-slide')];
  const dotsBox = root.querySelector('[data-slide-dots]');
  const prev = root.querySelector('[data-slide-prev]');
  const next = root.querySelector('[data-slide-next]');
  if (!track || !slides.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduce ? 'auto' : 'smooth';

  // quantos slides cabem por vez
  const perView = () => {
    const w = window.innerWidth;
    return w >= 900 ? 3 : w >= 560 ? 2 : 1;
  };
  const pages = () => Math.max(1, Math.ceil(slides.length / perView()));

  let dots = [];
  function buildDots() {
    if (!dotsBox) return;
    dotsBox.innerHTML = '';
    dots = [];
    for (let i = 0; i < pages(); i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Ir para o grupo ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(btn);
      dots.push(btn);
    }
    sync();
  }

  function current() {
    const first = slides[0];
    if (!first) return 0;
    const step = first.getBoundingClientRect().width + 14;
    return Math.max(0, Math.min(pages() - 1, Math.round(track.scrollLeft / step)));
  }

  function sync() {
    const idx = current();
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }

  function goTo(i) {
    const step = slides[0].getBoundingClientRect().width + 14;
    track.scrollTo({ left: i * step, behavior });
  }

  prev?.addEventListener('click', () => goTo(Math.max(0, current() - 1)));
  next?.addEventListener('click', () => goTo(Math.min(pages() - 1, current() + 1)));
  track.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', buildDots);
  buildDots();
})();
