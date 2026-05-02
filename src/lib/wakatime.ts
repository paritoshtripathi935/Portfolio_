/**
 * Build-time Wakatime fetcher.
 *
 * The API key is read from process.env.WAKATIME_API_KEY in Astro frontmatter.
 * Frontmatter only runs on the build server, so the key is never shipped to
 * the client — we just inline the response data into the static HTML.
 *
 * SOC2 / privacy notes:
 *   - We deliberately do NOT surface the `projects` array. Project names can
 *     contain customer or internal repo identifiers.
 *   - We do NOT render specific files, branches, or git refs.
 *   - Languages, editors, operating_systems, categories are universal and safe.
 *
 * Auth: Bearer header. Range path param (last_7_days, last_30_days,
 * last_6_months, last_year, all_time). Rate limit: <10 req/s averaged
 * over any 5-minute window.
 */

export type WakaItem = {
  name: string;
  totalSeconds: number;
  percent: number;
};

export type WakatimeStats = {
  range: string;
  totalSeconds: number;
  humanReadableTotal: string;
  dailyAverageSeconds: number;
  bestDaySeconds: number;
  bestDayDate: string | null;
  languages: WakaItem[];
  editors: WakaItem[];
  operatingSystems: WakaItem[];
  categories: WakaItem[];
  /** Sum of percent across editor names that are AI-pair-programming tools. */
  aiAugmentedPercent: number;
  /** Direct AI telemetry from Wakatime (Cursor / Claude Code / Copilot etc instrumented). */
  aiAdditions: number;
  aiDeletions: number;
  humanAdditions: number;
  humanDeletions: number;
  aiPromptEvents: number;
  /** Share of code lines added that came from AI vs human typing. 0-100. */
  aiCodePercent: number;
};

export type WakatimeAllTime = {
  totalSeconds: number;
  humanReadableTotal: string;
  isUpToDate: boolean;
};

const AI_EDITORS = new Set(
  [
    "cursor",
    "claude",
    "claude code",
    "copilot",
    "github copilot",
    "windsurf",
    "zed",
    "supermaven",
    "tabnine",
    "codeium",
    "continue",
  ].map((s) => s.toLowerCase()),
);

const isAiEditor = (name: string): boolean => {
  const n = name.trim().toLowerCase();
  for (const a of AI_EDITORS) if (n.includes(a)) return true;
  return false;
};

const mapItem = (raw: any): WakaItem => ({
  name: raw.name ?? "Unknown",
  totalSeconds: raw.total_seconds ?? 0,
  percent: raw.percent ?? 0,
});

const authHeaders = (key: string) => ({
  // Wakatime personal API keys authenticate via Basic — Bearer is rejected.
  Authorization: `Basic ${Buffer.from(key).toString("base64")}`,
  Accept: "application/json",
  "User-Agent": "paritosh-portfolio-build",
});

// In Astro, `.env` values are exposed via import.meta.env in both dev and
// build, but process.env only gets populated during `astro build`. Read both
// so dev server, build, and CI all behave the same.
const readKey = (): string | undefined =>
  process.env.WAKATIME_API_KEY ||
  (import.meta.env?.WAKATIME_API_KEY as string | undefined);

// Wakatime tracks browser windows as "editors". Browsers aren't where I
// write code, so filter them out of the editors list before display.
const BROWSER_EDITORS = new Set(
  ["arc", "safari", "chrome", "firefox", "edge", "opera", "brave", "vivaldi"].map(
    (s) => s.toLowerCase(),
  ),
);
const isBrowser = (name: string) =>
  BROWSER_EDITORS.has(name.trim().toLowerCase());

let statsCache = new Map<string, WakatimeStats | null>();
let allTimeCache: WakatimeAllTime | null | undefined;

const range404Misses = new Set<string>();

export const getWakatimeStats = async (
  range: string = "last_30_days",
): Promise<WakatimeStats | null> => {
  const key = readKey();
  if (!key) return null;
  if (statsCache.has(range)) return statsCache.get(range)!;
  if (range404Misses.has(range)) return null;

  try {
    const res = await fetch(
      `https://wakatime.com/api/v1/users/current/stats/${range}`,
      { headers: authHeaders(key) },
    );
    if (res.status === 404) {
      range404Misses.add(range);
      return null;
    }
    if (!res.ok) {
      console.warn(`[wakatime] stats/${range} -> ${res.status}`);
      statsCache.set(range, null);
      return null;
    }
    const json = await res.json();
    const data = json?.data;
    if (!data) {
      statsCache.set(range, null);
      return null;
    }
    const editorsRaw: WakaItem[] = (data.editors ?? []).map(mapItem);
    const editors = editorsRaw.filter((e) => !isBrowser(e.name));
    const aiAugmentedPercent = editors
      .filter((e) => isAiEditor(e.name))
      .reduce((s, e) => s + e.percent, 0);

    // Drop the "Other" bucket Wakatime emits for unidentifiable file types —
    // it's noise rather than signal.
    const languages = (data.languages ?? [])
      .map(mapItem)
      .filter((l: WakaItem) => l.name.toLowerCase() !== "other");

    const aiAdditions = data.ai_additions ?? 0;
    const aiDeletions = data.ai_deletions ?? 0;
    const humanAdditions = data.human_additions ?? 0;
    const humanDeletions = data.human_deletions ?? 0;
    const totalAdds = aiAdditions + humanAdditions;
    const aiCodePercent = totalAdds > 0 ? (aiAdditions / totalAdds) * 100 : 0;

    const stats: WakatimeStats = {
      range,
      totalSeconds: data.total_seconds ?? 0,
      humanReadableTotal: data.human_readable_total ?? "",
      dailyAverageSeconds: data.daily_average ?? 0,
      bestDaySeconds: data.best_day?.total_seconds ?? 0,
      bestDayDate: data.best_day?.date ?? null,
      languages,
      editors,
      operatingSystems: (data.operating_systems ?? []).map(mapItem),
      categories: (data.categories ?? []).map(mapItem),
      aiAugmentedPercent,
      aiAdditions,
      aiDeletions,
      humanAdditions,
      humanDeletions,
      aiPromptEvents: data.ai_prompt_events ?? 0,
      aiCodePercent,
    };
    statsCache.set(range, stats);
    return stats;
  } catch (err) {
    console.warn("[wakatime] stats fetch failed:", err);
    statsCache.set(range, null);
    return null;
  }
};

export const getWakatimeAllTime = async (): Promise<WakatimeAllTime | null> => {
  const key = readKey();
  if (!key) return null;
  if (allTimeCache !== undefined) return allTimeCache;

  try {
    const res = await fetch(
      `https://wakatime.com/api/v1/users/current/all_time_since_today`,
      { headers: authHeaders(key) },
    );
    if (!res.ok) {
      console.warn(`[wakatime] all_time -> ${res.status}`);
      allTimeCache = null;
      return null;
    }
    const json = await res.json();
    const data = json?.data;
    if (!data) {
      allTimeCache = null;
      return null;
    }
    allTimeCache = {
      totalSeconds: data.total_seconds ?? 0,
      humanReadableTotal: data.text ?? data.human_readable_total ?? "",
      isUpToDate: !!data.is_up_to_date,
    };
    return allTimeCache;
  } catch (err) {
    console.warn("[wakatime] all_time fetch failed:", err);
    allTimeCache = null;
    return null;
  }
};

/** Per-day total from Wakatime summaries, bucketed for heatmap rendering. */
export type WakatimeDay = {
  date: string;
  totalSeconds: number;
  level: 0 | 1 | 2 | 3 | 4;
};

const bucketActivity = (seconds: number): 0 | 1 | 2 | 3 | 4 => {
  if (seconds <= 0) return 0;
  if (seconds < 30 * 60) return 1; // < 30 min
  if (seconds < 2 * 60 * 60) return 2; // 30 min – 2 h
  if (seconds < 4 * 60 * 60) return 3; // 2 – 4 h
  return 4; // 4 h+
};

let summariesCache: WakatimeDay[] | null = null;
let summariesPromise: Promise<WakatimeDay[]> | null = null;

const fetchSummaries = async (days: number): Promise<WakatimeDay[]> => {
  const key = readKey();
  if (!key) return [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - days + 1);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = today.toISOString().slice(0, 10);
  try {
    const res = await fetch(
      `https://wakatime.com/api/v1/users/current/summaries?start=${startStr}&end=${endStr}`,
      { headers: authHeaders(key) },
    );
    if (!res.ok) {
      console.warn(`[wakatime] summaries -> ${res.status}`);
      return [];
    }
    const json = await res.json();
    const out: WakatimeDay[] = (json?.data ?? []).map((row: any) => {
      const date = row?.range?.date ?? "";
      const totalSeconds = row?.grand_total?.total_seconds ?? 0;
      return { date, totalSeconds, level: bucketActivity(totalSeconds) };
    });
    return out;
  } catch (err) {
    console.warn("[wakatime] summaries fetch failed:", err);
    return [];
  }
};

export const getWakatimeSummaries = async (
  days: number = 365,
): Promise<WakatimeDay[]> => {
  if (summariesCache) return summariesCache;
  if (!summariesPromise) {
    summariesPromise = fetchSummaries(days).then((d) => {
      summariesCache = d;
      return d;
    });
  }
  return summariesPromise;
};

export const formatWakaDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
