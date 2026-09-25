import { animate, inView, hover, stagger } from "motion";

const spring = { type: "spring", stiffness: 260, damping: 26 } as const;

/**
 * Staggered spring reveal + hover lift for every `[data-motion-grid]` on the page.
 * Cards are hidden only once this runs, so they never stay invisible without JS.
 */
const init = () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>("[data-motion-grid]").forEach((grid) => {
    if (grid.dataset.motion === "1") return;
    grid.dataset.motion = "1";
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-motion-card], .sys-card"));
    if (!cards.length) return;

    animate(cards, { opacity: 0, y: 48 }, { duration: 0 });
    inView(
      grid,
      () => {
        animate(cards, { opacity: 1, y: 0 }, { ...spring, delay: stagger(0.07) });
      },
      { amount: 0.1 },
    );

    hover(cards, (card) => {
      animate(card, { y: -8 }, spring);
      return () => animate(card, { y: 0 }, spring);
    });
  });
};

export const initCardMotion = () => {
  init();
  document.addEventListener("astro:page-load", init);
};
