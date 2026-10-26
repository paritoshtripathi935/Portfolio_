export type Project = {
  name: string;
  blurb: string;
  language: string;
  stars?: number;
  href: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    name: "MiniPerplexity",
    blurb: "PaidPilot — a web-search assistant with live citations, used by 100+ people. LLaMA 70B RAG on Cloudflare Workers.",
    language: "TypeScript",
    stars: 6,
    href: "https://github.com/paritoshtripathi935/MiniPerplexity",
    liveUrl: "https://paid.pilot.paritosh.online/",
  },
  {
    name: "MiniHarvery",
    blurb: "Vidhi — a research assistant for Indian law that checks its own citations and starts answering in under 2s.",
    language: "TypeScript",
    href: "https://github.com/paritoshtripathi935/MiniHarvery",
    liveUrl: "https://vidhi.paritosh.online/",
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
