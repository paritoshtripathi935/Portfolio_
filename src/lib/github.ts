/**
 * Build-time GitHub fetcher.
 *
 * Pulls owned, non-fork repos for a user once per build (memoized at module scope)
 * and exposes per-repo stats by name. Falls back to null on any failure so callers
 * can degrade gracefully to their hand-written copy.
 */

export type RepoStats = {
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
  htmlUrl: string;
  homepage: string | null;
  description: string | null;
  archived: boolean;
};

let cache: Map<string, RepoStats> | null = null;
let cachePromise: Promise<Map<string, RepoStats> | null> | null = null;

const USER = "paritoshtripathi935";

const fetchAllRepos = async (): Promise<Map<string, RepoStats> | null> => {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "paritosh-portfolio-build",
    };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?sort=updated&per_page=100&type=owner`,
      { headers },
    );
    if (!res.ok) {
      console.warn(`[github] ${res.status} ${res.statusText} — falling back to static data`);
      return null;
    }
    const data: any[] = await res.json();
    const map = new Map<string, RepoStats>();
    for (const r of data) {
      if (r.fork) continue;
      const homepage =
        typeof r.homepage === "string" && r.homepage.trim().length > 0
          ? r.homepage.trim()
          : null;
      map.set((r.name as string).toLowerCase(), {
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        language: r.language ?? null,
        pushedAt: r.pushed_at,
        htmlUrl: r.html_url,
        homepage,
        description: r.description,
        archived: !!r.archived,
      });
    }
    return map;
  } catch (err) {
    console.warn(`[github] fetch failed:`, err);
    return null;
  }
};

export const getReposByName = async (): Promise<Map<string, RepoStats> | null> => {
  if (cache) return cache;
  if (!cachePromise) {
    cachePromise = fetchAllRepos().then((m) => {
      cache = m;
      return m;
    });
  }
  return cachePromise;
};

export const getRepoStats = async (name: string): Promise<RepoStats | null> => {
  const map = await getReposByName();
  return map?.get(name.toLowerCase()) ?? null;
};

/**
 * Per-day contribution counts pulled from the public
 * github-contributions-api.jogruber.de endpoint (no auth required).
 * Multiple usernames are fetched in parallel and merged by date — sums
 * the counts, then re-buckets the level so the heatmap reflects the
 * combined activity across all accounts.
 */

export type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

const contribCache = new Map<string, ContributionDay[]>();

/** year is "last" for the rolling 12-month window, or a 4-digit year string. */
const fetchOne = async (
  username: string,
  year: string,
): Promise<ContributionDay[]> => {
  const key = `${username}@${year}`;
  if (contribCache.has(key)) return contribCache.get(key)!;
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
      { headers: { "User-Agent": "paritosh-portfolio-build" } },
    );
    if (!res.ok) {
      console.warn(`[github] contributions ${username}/${year} -> ${res.status}`);
      return [];
    }
    const data = await res.json();
    const days: ContributionDay[] = (data.contributions ?? []).map((d: any) => ({
      date: d.date,
      count: d.count ?? 0,
      level: (d.level ?? 0) as 0 | 1 | 2 | 3 | 4,
    }));
    contribCache.set(key, days);
    return days;
  } catch (err) {
    console.warn(`[github] contributions ${username}/${year} failed:`, err);
    return [];
  }
};

const bucketLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count <= 0) return 0;
  if (count < 4) return 1;
  if (count < 8) return 2;
  if (count < 14) return 3;
  return 4;
};

export type YearContributions = { days: ContributionDay[]; total: number };

export const getMergedContributions = async (
  usernames: string[],
  year: string = "last",
): Promise<YearContributions> => {
  const all = await Promise.all(usernames.map((u) => fetchOne(u, year)));
  const merged = new Map<string, number>();
  for (const list of all) {
    for (const d of list) {
      merged.set(d.date, (merged.get(d.date) ?? 0) + d.count);
    }
  }
  const days: ContributionDay[] = Array.from(merged.entries())
    .map(([date, count]) => ({ date, count, level: bucketLevel(count) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const total = days.reduce((s, d) => s + d.count, 0);
  return { days, total };
};

/** Fetches multiple years in parallel and returns a year-keyed map. */
export const getMultiYearContributions = async (
  usernames: string[],
  years: string[],
): Promise<Record<string, YearContributions>> => {
  const entries = await Promise.all(
    years.map(async (y) => [y, await getMergedContributions(usernames, y)] as const),
  );
  return Object.fromEntries(entries);
};

export const formatRelativeTime = (iso: string): string => {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  const mo = Math.round(day / 30);
  const yr = Math.round(day / 365);
  if (sec < 60) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 30) return `${day}d ago`;
  if (mo < 12) return `${mo}mo ago`;
  return `${yr}y ago`;
};
