const slugs: Record<string, string> = {
  python: "python",
  go: "go",
  django: "django",
  "django rest": "django",
  fastapi: "fastapi",
  postgresql: "postgresql",
  opensearch: "opensearch",
  elasticsearch: "elasticsearch",
  redis: "redis",
  mongodb: "mongodb",
  docker: "docker",
  kubernetes: "kubernetes",
  jenkins: "jenkins",
  bigquery: "googlebigquery",
  grafana: "grafana",
};

export const techIconUrl = (name: string): string | null => {
  const slug = slugs[name.toLowerCase()];
  return slug ? `https://cdn.simpleicons.org/${slug}/ededed` : null;
};
