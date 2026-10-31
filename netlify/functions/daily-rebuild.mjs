// GitHub and WakaTime stats are fetched at build time, so rebuild daily to keep them fresh.
// BUILD_HOOK_URL is a Netlify build hook for the production branch, set in Netlify env vars.
export default async () => {
  const url = process.env.BUILD_HOOK_URL;
  if (!url) {
    console.warn("BUILD_HOOK_URL not set — skipping daily rebuild");
    return new Response("BUILD_HOOK_URL not set", { status: 500 });
  }
  const res = await fetch(url, { method: "POST" });
  console.log(`build hook -> ${res.status}`);
  return new Response(null, { status: res.ok ? 200 : 502 });
};

// 00:30 UTC = 06:00 IST
export const config = { schedule: "30 0 * * *" };
