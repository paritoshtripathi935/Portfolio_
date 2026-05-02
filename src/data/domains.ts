export type Domain = {
  slug: string;
  title: string;
  blurb: string;
  items: string[];
  era: "parspec" | "anakin";
};

export const domains: Domain[] = [
  {
    slug: "rest-api",
    title: "Public REST API",
    era: "parspec",
    blurb:
      "Backend lead for the externally-facing REST API at Parspec. End-to-end CRUD surfaces, atomic batch endpoints (Google AIP-133/233/234, MS Graph conventions), error-message translation for external consumers.",
    items: [
      "Projects API — full GET/POST/PATCH/DELETE with auth scoping",
      "Inventory REST + atomic batch create/delete (≤100 items per call)",
      "Manufacturer REST API",
      "API standardization — camelCase, plurality, flat responses",
      "Error-handling translation for external API consumers",
    ],
  },
  {
    slug: "erp",
    title: "ERP Integrations",
    era: "parspec",
    blurb:
      "Backend owner for every shipped ERP integration epic at Parspec. Designed publish-to-ERP event payloads and the byErpId lookup pattern used across Goods Receipt and Delivery Confirmation.",
    items: [
      "Delivery Ticket integration",
      "Delivery Confirmation updates from ERP",
      "Goods Receipt updates from ERP",
      "Change Order integration",
      "Credit & Returns integration",
      "Inventory integrations across Eclipse / SAP / JD Edwards / Prophet 21",
    ],
  },
  {
    slug: "event-driven",
    title: "Event-driven Pipelines",
    era: "anakin",
    blurb:
      "At Anakin, architected a fault-tolerant distributed pipeline processing 150 GB/day across 4 teams at 99.95% availability, plus event-driven microservices handling 150M+ events/month with 50K events/min peak.",
    items: [
      "150 GB/day fault-tolerant pipeline on AWS SQS / S3 / ECS",
      "150M+ events/month at 99.9% uptime, 50K events/min peak",
      "Data partitioning + async processing for horizontal scale",
      "Cut reprocessing overhead 15% and infra costs $3K/month",
    ],
  },
  {
    slug: "microservice-patterns",
    title: "Microservice Patterns",
    era: "anakin",
    blurb:
      "Reusable microservice templates and domain-driven patterns adopted across 6 teams at Anakin — feature dev time dropped from 2 days to 3 hours, with 12+ services scaling independently.",
    items: [
      "Reusable Python microservice templates adopted by 6 teams",
      "Domain-driven boundaries enabling independent scaling of 12+ services",
      "Resolved 50+ critical production incidents (Grafana + K8s + Slack alerts)",
      "Engineer of the Quarter, Q3 2024 — 35% throughput improvement",
    ],
  },
  {
    slug: "order-mgmt",
    title: "Order Management",
    era: "parspec",
    blurb:
      "Credits, Returns, Lots, Change Orders. Owned the largest order-management epic at Parspec end-to-end — create/edit APIs, credit-memo reconciliation, ERP publishing, financial transactions.",
    items: [
      "Credits & Returns workflow (14 backend tickets shipped end-to-end)",
      "Lot handling — DB migration, lot-drawer creation, locking logic",
      "Manufacturer evolution data-model upgrades",
      "Customer & internal change-order log",
    ],
  },
  {
    slug: "search",
    title: "Search & Ranking",
    era: "parspec",
    blurb:
      "Led the Product Finder move from hard to soft filtering. Designed the ranking algorithm (mounting 5×, application 2×, others 1×) and Strong / Medium / Weak match-strength buckets. Improved search accuracy 21% via ML image similarity and vector search.",
    items: [
      "Soft-filtering ranking algorithm + match-strength buckets",
      "ML-driven image similarity + vector search on Elasticsearch / OpenSearch",
      "Datasheet de-duplication on index",
      "PF Card cost range with inventory data",
      "Search OKR metrics analysis",
    ],
  },
  {
    slug: "perf-obs",
    title: "Performance & Observability",
    era: "parspec",
    blurb:
      "Set explicit p90 latency budgets at Parspec (1.5s/3s/6s by manufacturer count). Built two latency-reporting dashboards (DB / API / AI / Network breakdowns at p50/p90/p95). At Anakin, built Looker Studio dashboards on BigQuery cutting defect resolution time 29%.",
    items: [
      "PF latency improvements + p90 budget enforcement",
      "Latency dashboards for project creation & parsing",
      "Sub-100ms P99 latency on REST APIs via Redis caching",
      "Looker Studio + BigQuery dashboards (Anakin) — 29% faster defect resolution",
    ],
  },
  {
    slug: "infra",
    title: "Async Infra & Dev Platform",
    era: "parspec",
    blurb:
      "Foundational platform work at Parspec — moving long-running work off the request path, plus Hermes (per-branch ephemeral environments) used by every other engineer.",
    items: [
      "Hermes — per-branch ephemeral environments (100+ envs, 4h → 8min setup)",
      "Unified async-task solution",
      "PR-based deployments lifting team velocity 30%",
    ],
  },
  {
    slug: "security",
    title: "Security",
    era: "parspec",
    blurb:
      "Two dedicated security epics at Parspec, plus security-by-design in REST API work — auth scoping, input validation, error messages that don't leak DB internals.",
    items: [
      "Cloud / server security assessment of production DBs and replicas",
      "Inventory-service security audit",
      "Security vulnerability remediation",
    ],
  },
  {
    slug: "permissions",
    title: "Permissions & Data Modeling",
    era: "parspec",
    blurb:
      "RBAC, Project / Scope / BOM hierarchy redesign, and OCR pipeline optimization. Cross-service code review on mvp / sonic / inventory.",
    items: [
      "Advanced user permissions (OSR-based RBAC)",
      "Multi-Scopes — Project / Scope / BOM hierarchy redesign",
      "OCR data pipeline optimization",
    ],
  },
];
