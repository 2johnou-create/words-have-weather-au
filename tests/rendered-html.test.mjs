import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Words Have Weather landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Words Have Weather \| Keep the boundary\./i);
  assert.match(html, /The rule can be right\./);
  assert.match(html, /The weather can still change\./);
  assert.match(html, /35–45 sec/);
  assert.match(html, /Every 2nd day/);
  assert.match(html, /Reveal the next sentence/);
  assert.match(html, /Correct in private/);
  assert.match(html, /Emotion is weather—not identity/);
  assert.match(html, /Start with the pressure—not a perfect-parent fantasy/);
  assert.match(html, /The adult may be carrying/);
  assert.match(html, /Three age lenses keep the advice specific/);
  assert.match(html, /Take the story off-screen/);
  assert.match(html, /15 stories · 30 illustrated A4 resources/);
  assert.match(html, /episode-01-educator-worksheet[.]pdf/);
  assert.match(html, /episode-01-parent-practice-workbook[.]pdf/);
  assert.match(html, /Complete Season 1 collection/);
  assert.match(html, /Every moment now has a practice pack/);
  const resourceLinks = html.match(/\/downloads\/episode-\d{2}-(?:educator-worksheet|parent-practice-workbook)[.]pdf/g) ?? [];
  assert.equal(new Set(resourceLinks).size, 30);
  assert.doesNotMatch(html, /Pilot sample only/);
  assert.match(html, /evidence reviewed 24 August 2026/i);
  assert.match(html, /Some moments need more than a next sentence/);
  assert.match(html, /aifs\.gov\.au/);
  assert.match(html, /esafety\.gov\.au/);
  assert.match(html, /humanrights\.gov\.au/);
  assert.match(html, /\/stories\/spill-repair\.webp/);
  assert.match(html, /\/stories\/kerb-safety\.webp/);
  assert.match(html, /\/stories\/private-correction\.webp/);
  assert.match(html, /\/stories\/emotional-moments\.webp/);
  assert.match(html, /Commercially neutral stories/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|29 Coffee/i);
});

test("removes starter assets and retains project imagery", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /character-lineup\.png/);
  assert.match(layout, /lang="en-AU"/);
  assert.match(layout, /x-forwarded-proto/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/character-lineup.png", import.meta.url));
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/stories/spill-repair.webp", import.meta.url));
  await access(new URL("../public/stories/kerb-safety.webp", import.meta.url));
  await access(new URL("../public/stories/private-correction.webp", import.meta.url));
  await access(new URL("../public/stories/emotional-moments.webp", import.meta.url));
  for (let episode = 1; episode <= 15; episode += 1) {
    const id = String(episode).padStart(2, "0");
    await access(new URL(`../public/downloads/episode-${id}-educator-worksheet.pdf`, import.meta.url));
    await access(new URL(`../public/downloads/episode-${id}-parent-practice-workbook.pdf`, import.meta.url));
    await access(new URL(`../public/resources/episode-${id}-educator-worksheet-preview.webp`, import.meta.url));
    await access(new URL(`../public/resources/episode-${id}-parent-practice-workbook-preview.webp`, import.meta.url));
  }
  await access(new URL("../RESEARCH_NOTES.md", import.meta.url));
  await assert.rejects(access(new URL("../app/_sites-preview", projectRoot)));
});
