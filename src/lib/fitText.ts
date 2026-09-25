/** Scale every `.fit-line` so its text spans the full width of the line (up to data-fit-max px). */
const fit = () => {
  document.querySelectorAll<HTMLElement>(".fit-line").forEach((line) => {
    if (!line.offsetParent) return;
    const text = line.firstElementChild as HTMLElement | null;
    if (!text) return;
    if (!line.clientWidth) return;
    line.style.setProperty("--fs", "100px");
    const w = text.getBoundingClientRect().width;
    if (!w) return;
    // data-fit-max caps the size so short text doesn't balloon.
    const max = Number(line.dataset.fitMax) || Infinity;
    line.style.setProperty("--fs", `${Math.min((100 * line.clientWidth) / w, max)}px`);
  });
};

export const initFitText = () => {
  const run = () => {
    fit();
    document.fonts?.ready.then(fit);
  };
  run();
  document.addEventListener("astro:page-load", run);
  let t = 0;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = window.setTimeout(fit, 80);
  });
};
