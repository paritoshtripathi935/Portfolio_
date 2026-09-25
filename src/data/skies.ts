// Painted-sky palettes used by the .sky bands: [top colour, horizon colour, sun x-position].
// Case studies and companies each get their own dusk so cards stay distinguishable.
export type Sky = [string, string, string];

export const skies: Record<string, Sky> = {
  default: ["#121a3d", "#c98a55", "62%"],

  // Case studies
  atlas: ["#17214d", "#d0925a", "68%"],
  iris: ["#2a1f4f", "#d97a6c", "30%"],
  argus: ["#0e1830", "#8b6aa0", "75%"],
  ariadne: ["#3a1c1f", "#e3a256", "40%"],
  proteus: ["#0d2a36", "#62a39d", "62%"],
  hydra: ["#1b2a22", "#b8a25a", "35%"],

  // Companies
  sharpsell: ["#151d4a", "#e0a05c", "72%"],
  parspec: ["#241a45", "#c9788a", "28%"],
  anakin: ["#0d2a36", "#6aa89f", "58%"],
};

// Rotating palette for cards without a named sky (e.g. side projects).
const rotation: Sky[] = [
  skies.ariadne,
  skies.proteus,
  skies.iris,
  skies.hydra,
  skies.argus,
  skies.atlas,
];

export const skyFor = (key: string, index = 0): Sky => skies[key] ?? rotation[index % rotation.length];

export const skyStyle = (sky: Sky) => `--sky-a:${sky[0]};--sky-b:${sky[1]};--sun-x:${sky[2]}`;
