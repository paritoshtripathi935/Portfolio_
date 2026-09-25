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
    slug: "sharpsell",
    company: "Sharpsell",
    role: "Software Engineer II",
    period: "Jun 2026 — Present",
    startDate: "2026-06",
    endDate: "2026-09",
    location: "Bangalore",
    current: true,
    summary:
      "Leading the move from legacy Python ETLs and oversized RDS OLAP instances to a multi-tenant ClickHouse + dbt analytics platform — ELT, CDC, migration tooling, and the AI tooling around it.",
    bullets: [
      "Architected a high-throughput ClickHouse & dbt ELT platform across 100+ tenants, replacing legacy Python ETLs — nightly runtimes 5 hours → 15 minutes (20× speedup) and analytical query latency from 15+ seconds down to 1–2 seconds.",
      "Decommissioned heavy db.m7g.8xlarge RDS OLAP instances by provisioning ClickHouse on AWS ECS via AWS CDK with EC2 capacity providers — database costs down 85% (~$25,000/year) and storage down 75% (1 TB → ~200 GB) via columnar compression.",
      "Architected a zero-downtime Postgres → ClickHouse CDC pipeline (PeerDB on ECS Fargate) across 4 microservices, replacing CPU autoscaling with step-scaling on custom CloudWatch metrics to keep replication-slot lag under 1 GB across multi-tenant mirrors.",
      "Engineered an idempotent upsert migration framework with a custom Python query-translation engine that rewrites legacy SQL to ClickHouse SQL — seamless cutovers for 100+ Superset client dashboards.",
      "Developed custom Model Context Protocol (MCP) servers for Apache Superset and ClickHouse, accelerating agentic AI workflows for automated SQL translation, live query execution, and system debugging.",
    ],
    stack: ["ClickHouse", "dbt", "Python", "PostgreSQL", "PeerDB", "AWS", "Superset", "MCP"],
    highlights: [
      { value: "20×", label: "faster nightly ELT" },
      { value: "85%", label: "DB cost cut" },
      { value: "100+", label: "tenants" },
      { value: "1–2s", label: "query latency" },
    ],
  },
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
      "Designed and implemented a Go saga-based inventory ingestion service that keeps DynamoDB and OpenSearch consistent via compensating rollback, using DynamoDB conditional-write distributed locks to serialize 3.9M+ concurrent writes across 7,800+ manufacturers at 0.3 ms avg latency and p99 under 5 ms.",
      "Built a Python FastAPI control plane on ECS Fargate, ALB host-header routing, CodeBuild, and Route53 that provisions per-branch ephemeral environments — turning multi-hour manual setup into a self-service API and driving 7× growth in active developers.",
      "Owned the public application API: designed Google AIP-compliant batch endpoints and the v2 redesign over PostgreSQL, Aurora, and OpenSearch, serving 100K+ items/hour at sub-100ms p99.",
      "Designed ERP financial-workflow integrations — credits & returns, goods receipt, and delivery tickets — over Workato webhooks on a byErpId lookup pattern, with automatic partial-quantity line splitting across SAP, JD Edwards, and Eclipse.",
      "Led Product Finder 2.0: a config-driven weighted soft-ranking engine for +23% accuracy; parallelized OpenSearch fetches with goroutines to cut latency 10 ms → 2 ms; Mixpanel metrics at every ranking step.",
      "Designed Nexus and Kronos — the platform's async-task and centralized-cron services on SQS, ECS, and WebSocket with DLQ-backed retries and queue-depth autoscaling.",
    ],
    stack: ["Python", "Go", "Django", "FastAPI", "PostgreSQL", "DynamoDB", "OpenSearch", "Redis", "AWS"],
    highlights: [
      { value: "43", label: "epics" },
      { value: "115", label: "tickets" },
      { value: "3.9M+", label: "saga writes" },
      { value: "<100ms", label: "API p99" },
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
        blurb: "Product Finder 2.0 — config-driven weighted soft-ranking, +23% accuracy, 10 ms → 2 ms fetches.",
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
      "Developed a config-driven Generic Compiler Service on FastAPI transforming unstructured data into structured datasets at 100 GB/day, with dual-queue SQS, DLQ, and multi-sink writes to MongoDB, BigQuery, and S3 — new-team onboarding cut from 3 days to 4 hours.",
      "Designed an event-driven microservice architecture handling 150M+ events/month at 99.9% uptime, using async consumers and backpressure to absorb 50K-events-per-minute peaks; several teams reused the pattern.",
      "Built an Android device-orchestration platform in Python with scheduling across on-prem and cloud device pools, Frida runtime injection, and lifecycle tracking — 100+ connected devices across concurrent automation sessions.",
      "Developed reusable microservice templates in Python and Go adopted by 6 teams, compressing feature dev from 2 days to 3 hours; resolved 50+ production incidents and cut infra cost $3K/month using S3 Glacier and CloudWatch Logs.",
      "Built BigQuery + Looker Studio analytics with Grafana monitoring on Kubernetes and automated Slack alerting — reprocessing overhead down 40%, on-call escalations down 30%.",
      "Engineer of the Quarter, Q3 2024 — for backend throughput gains, production-incident resolution, and mentoring junior engineers.",
    ],
    stack: ["AWS", "Python", "MongoDB", "Docker", "Kubernetes", "Jenkins", "BigQuery", "Grafana"],
    highlights: [
      { value: "100 GB", label: "per day" },
      { value: "150M+", label: "events / mo" },
      { value: "99.9%", label: "uptime" },
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
