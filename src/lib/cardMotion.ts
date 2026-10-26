/**
 * Staggered reveal for every `[data-motion-grid]`; the motion itself is CSS (see `[data-motion]` in global.css).
 * Cards are hidden only once this runs, so they never stay invisible without JS.
 */
const init = () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.motion = "in";
        io.unobserve(e.target);
      }
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll<HTMLElement>("[data-motion-grid]:not([data-motion])").forEach((grid) => {
    grid.querySelectorAll<HTMLElement>("[data-motion-card], .sys-card").forEach((card, i) => card.style.setProperty("--i", String(i)));
    grid.dataset.motion = "pending";
    io.observe(grid);
  });
};

export const initCardMotion = () => {
  init();
  document.addEventListener("astro:page-load", init);
};
