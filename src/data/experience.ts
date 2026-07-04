export type Experience = {
  slug: string;
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string;
  location?: string;
  summary: string;
  bullets: string[];
  stack: string[];
  current?: boolean;
  highlights?: { value: string; label: string }[];
  caseStudies?: { name: string; href: string; blurb: string }[];
};

export const experience: Experience[] = [
  {
    slug: "parspec",
    company: "Parspec",
    role: "Software Engineer II",
    period: "Apr 2025 — Jun 2026",
    startDate: "2025-04",
    endDate: "2026-06",
    location: "Bangalore",
    summary:
      "Backend lead for the public REST API and the ERP integrations program at Parspec — the platform that distributors and electrical contractors use to quote, submit, and fulfill construction projects. Owned 43 epics across 115 tickets in 12 months, working across the most critical parts of the product.",
    bullets: [
      "Led the redesign of a core inventory microservice — 10K+ distributed operations under 300s at 99.6% success via a SAGA-based distributed locking system.",
      "Delivered REST APIs (Django, FastAPI) on DynamoDB / PostgreSQL / OpenSearch serving 100K+ items/hour with sub-100ms P99 latency via Redis caching.",
      "Built an internal automation platform — 100+ isolated PR environments — cutting setup time 95% (4h → 8min) and lifting team velocity 30%.",
      "Owned 20+ production APIs handling 50K+ daily requests at 99.8% uptime, monitored via CloudWatch and custom metrics.",
      "Improved search accuracy 21% via ML-driven image similarity and vector search on Elasticsearch / OpenSearch.",
      "Established documentation standards and authored 7+ ADRs for cross-team knowledge sharing.",
    ],
    stack: ["Python", "Go", "Django", "FastAPI", "PostgreSQL", "DynamoDB", "OpenSearch", "Redis", "AWS"],
    highlights: [
      { value: "43", label: "epics" },
      { value: "115", label: "tickets" },
      { value: "20+", label: "prod APIs" },
      { value: "<100ms", label: "P99 latency" },
    ],
    caseStudies: [
      {
        name: "Iris",
        href: "/work/iris",
        blurb: "Per-branch ephemeral environments — 1,567 builds, 88% end-to-end success, 7× DAU growth.",
      },
      {
        name: "Argus",
        href: "/work/argus",
        blurb: "Saga + per-SKU locks behind 3.9M+ writes across 7,800+ manufacturers.",
      },
      {
        name: "Ariadne",
        href: "/work/ariadne",
        blurb: "Soft-filtering search engine with weighted ranking and ML image similarity — 21% accuracy lift.",
      },
    ],
  },
  {
    slug: "anakin",
    company: "Anakin (YC S21)",
    role: "Software Engineer I",
    period: "Aug 2022 — Dec 2024",
    startDate: "2022-08",
    endDate: "2024-12",
    location: "Bangalore",
    summary:
      "Founding-team backend engineer. Built the platform infra that the rest of the team built on top of — distributed pipelines, event-driven microservices, and Android device-orchestration capacity. Engineer of the Quarter, Q3 2024.",
    bullets: [
      "Architected a fault-tolerant distributed pipeline processing 150 GB/day across 4 teams (AWS SQS / S3 / ECS, MongoDB, Docker, Jenkins) at 99.95% availability.",
      "Cut reprocessing overhead 15% and infra costs $3K/month; built Looker Studio dashboards on BigQuery cutting defect resolution time 29%.",
      "Designed event-driven microservice architecture — 150M+ events/month at 99.9% uptime, 50K events/min peak — via partitioning and async processing.",
      "Engineered reusable microservice templates and DDD patterns adopted by 6 teams — feature dev time 2 days → 3 hours, scaling 12+ services independently.",
      "Resolved 50+ critical production incidents using Grafana + Kubernetes + Slack alerting, decreasing escalations 30%.",
      "Engineer of the Quarter, Q3 2024 — recognized for backend optimizations that lifted data throughput 35%.",
    ],
    stack: ["AWS", "Python", "MongoDB", "Docker", "Kubernetes", "Jenkins", "BigQuery", "Grafana"],
    highlights: [
      { value: "150 GB", label: "per day" },
      { value: "150M+", label: "events / mo" },
      { value: "99.95%", label: "availability" },
      { value: "6 teams", label: "adopted templates" },
    ],
    caseStudies: [
      {
        name: "Proteus",
        href: "/work/proteus",
        blurb: "Config-driven FastAPI pipeline replacing per-team custom compilers — 200 GB/day peak.",
      },
      {
        name: "Hydra",
        href: "/work/hydra",
        blurb: "Hybrid Pixel + Genymotion automation with Frida runtime injection across 100+ devices.",
      },
    ],
  },
];
