export type Project = {
  name: string;
  blurb: string;
  language: string;
  stars?: number;
  href: string;
};

export const projects: Project[] = [
  {
    name: "MiniPerplexity",
    blurb:
      "Perplexity-style conversational search — plain-English questions answered from live Google + Bing results.",
    language: "TypeScript",
    stars: 6,
    href: "https://github.com/paritoshtripathi935/MiniPerplexity",
  },
  {
    name: "MiniHarvery",
    blurb: "AI research workbench for Indian law — structured legal briefs with live citations.",
    language: "TypeScript",
    href: "https://github.com/paritoshtripathi935/MiniHarvery",
  },
  {
    name: "GlitchAgent",
    blurb: "AI agent that automates browser workflows from natural-language commands.",
    language: "Python",
    stars: 2,
    href: "https://github.com/paritoshtripathi935/GlitchAgent",
  },
  {
    name: "DocSync",
    blurb: "Real-time collaborative document editor with conflict resolution.",
    language: "Python",
    href: "https://github.com/paritoshtripathi935/DocSync",
  },
  {
    name: "Product-Matching",
    blurb: "NLP + image recognition + collaborative filtering for product matching.",
    language: "Python",
    stars: 17,
    href: "https://github.com/paritoshtripathi935/Product-Matching",
  },
  {
    name: "RefineYourHire",
    blurb: "LLM-based application for HR process optimization.",
    language: "CSS",
    stars: 10,
    href: "https://github.com/paritoshtripathi935/RefineYourHire",
  },
  {
    name: "aishikabot",
    blurb: "CBT-based mental-health bot — accessible cognitive behavioral therapy support.",
    language: "Jupyter Notebook",
    stars: 6,
    href: "https://github.com/paritoshtripathi935/aishikabot",
  },
  {
    name: "GrabFood-Scraper",
    blurb: "XHR-based food-delivery scraper.",
    language: "Python",
    stars: 6,
    href: "https://github.com/paritoshtripathi935/GrabFood-Scraper",
  },
];
