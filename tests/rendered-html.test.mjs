import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

function testContext() {
  return { waitUntil() {}, passThroughOnException() {} };
}

test("the expanded landing page keeps the complete public promise", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  const source = `${layout}\n${page}`;
  assert.match(source, /Words Have Weather \| 120 stories/i);
  assert.match(source, /120 short stories · one connected learning journey/i);
  assert.match(source, /Explore all 120 episodes/);
  assert.equal((source.match(/count: 40/g) ?? []).length, 3);
  assert.match(source, /Sprout/);
  assert.match(source, /All Ages/);
  assert.match(source, /Trail/);
  assert.match(source, /eight-stage learning arc/i);
  assert.match(source, /15.*scheduled each month/is);
  assert.match(source, /Free educational membership/);
  assert.match(source, /educational-use terms/);
  assert.match(source, /character-lineup[.]png/);
  assert.doesNotMatch(source, /29 Coffee|commercial promotion|codex-preview/i);
});

test("catalogue contains a balanced 120-episode learning and release plan", async () => {
  const catalogue = JSON.parse(await readFile(new URL("../data/episode-catalog.json", import.meta.url), "utf8"));
  assert.equal(catalogue.length, 120);
  assert.deepEqual(
    Object.fromEntries(["Sprout", "All Ages", "Trail"].map((category) => [category, catalogue.filter((episode) => episode.category === category).length])),
    { Sprout: 40, "All Ages": 40, Trail: 40 },
  );
  assert.deepEqual(
    Object.fromEntries(Array.from({ length: 8 }, (_, index) => [index + 1, catalogue.filter((episode) => episode.stage === index + 1).length])),
    { 1: 15, 2: 15, 3: 15, 4: 15, 5: 15, 6: 15, 7: 15, 8: 15 },
  );
  const monthly = Object.groupBy(catalogue, (episode) => episode.releaseDate.slice(0, 7));
  assert.equal(Object.keys(monthly).length, 8);
  for (const episodes of Object.values(monthly)) assert.equal(episodes.length, 15);
  for (const episode of catalogue) {
    assert.ok(episode.keyLearning.length > 20);
    assert.ok(episode.curriculum.length >= 3);
    assert.match(episode.educatorPdf, /episode-\d{3}-educator-worksheet[.]pdf$/);
    assert.match(episode.parentPdf, /episode-\d{3}-parent-practice-workbook[.]pdf$/);
    assert.match(episode.heroImage, /episode-\d{3}-hero[.]webp$/);
  }
});

test("all 120 episode heroes, protected PDFs, previews and metadata files exist", async () => {
  const heroBytes = new Set();
  for (let episode = 1; episode <= 120; episode += 1) {
    const id = String(episode).padStart(3, "0");
    const hero = await readFile(new URL(`../public/episodes/episode-${id}-hero.webp`, import.meta.url));
    heroBytes.add(hero.toString("base64"));
    await access(new URL(`../public/resources/episode-${id}-educator-worksheet-preview.webp`, import.meta.url));
    await access(new URL(`../public/resources/episode-${id}-parent-practice-workbook-preview.webp`, import.meta.url));
    await access(new URL(`../public/downloads/episode-${id}-educator-worksheet.pdf`, import.meta.url));
    await access(new URL(`../public/downloads/episode-${id}-parent-practice-workbook.pdf`, import.meta.url));
    await access(new URL(`../public/content/episode-${id}.json`, import.meta.url));
  }
  assert.equal(heroBytes.size, 120);
  await access(new URL("../public/catalog/episodes.json", import.meta.url));
  await access(new URL("../public/og-120.png", import.meta.url));
  const publicDownloads = await readdir(new URL("../public/downloads/", import.meta.url));
  assert.equal(publicDownloads.filter((name) => name.endsWith(".pdf")).length, 240);
});

test("anonymous workbook downloads are sent through the member journey", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/downloads/episode-001-educator-worksheet.pdf"),
    { ASSETS: { fetch: async () => new Response("asset") } },
    testContext(),
  );
  assert.equal(response.status, 302);
  assert.match(response.headers.get("location") ?? "", /\/signin-with-chatgpt[?]return_to=%2Fdownloads%2Fepisode-001-educator-worksheet[.]pdf$/);
});

test("legacy two-digit workbook links redirect to the canonical protected path", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/downloads/episode-01-parent-practice-workbook.pdf?from=old-site"),
    { ASSETS: { fetch: async () => new Response("asset") } },
    testContext(),
  );
  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "http://localhost/downloads/episode-001-parent-practice-workbook.pdf?from=old-site",
  );
});

test("a signed-up member receives the protected versioned PDF asset", async () => {
  const worker = await getWorker();
  const db = {
    prepare(sql) {
      return {
        bind() {
          return {
            async first() {
              if (sql.includes("FROM members")) return { user_id: "member-1" };
              return null;
            },
            async run() { return { success: true }; },
          };
        },
      };
    },
  };
  const response = await worker.fetch(
    new Request("http://localhost/downloads/episode-001-educator-worksheet.pdf", {
      headers: { "oai-authenticated-user-id": "member-1" },
    }),
    {
      ASSETS: { fetch: async () => new Response("%PDF-episode-001", { status: 200, headers: { "content-type": "application/pdf" } }) },
      DB: db,
      RESOURCES: { get: async () => null },
    },
    testContext(),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.match(response.headers.get("content-disposition") ?? "", /episode-001-educator-worksheet[.]pdf/);
  assert.match(await response.text(), /^%PDF/);
});

test("member, admin and curriculum safeguards are wired into the site", async () => {
  const [worker, signup, admin, journey, hosting, migration, vite] = await Promise.all([
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/MemberSignupForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/AdminConsole.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/journey/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_little_mandrill.sql", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);
  assert.match(worker, /episode-\(\\d\{2,3\}\)/);
  assert.match(worker, /SELECT user_id FROM members/);
  assert.match(worker, /release_date/);
  assert.match(worker, /RESOURCES[.]get/);
  assert.match(worker, /ASSETS[.]fetch/);
  assert.doesNotMatch(worker, /bootstrap-resources|RESOURCE_BOOTSTRAP_TOKEN/);
  assert.match(worker, /padStart\(3, "0"\)/);
  assert.match(signup, /firstName/);
  assert.match(signup, /lastName/);
  assert.match(signup, /educationTerms/);
  assert.match(signup, /updatesOptIn/);
  assert.match(admin, /Select all 120/);
  assert.match(admin, /Enable/);
  assert.match(admin, /Disable/);
  assert.match(admin, /Remove/);
  assert.match(admin, /Schedule/);
  assert.match(admin, /zipSync/);
  assert.match(journey, /Possible connections, not a packaged curriculum/);
  assert.match(journey, /australiancurriculum[.]edu[.]au/);
  assert.equal(JSON.parse(hosting).d1, "DB");
  assert.equal(JSON.parse(hosting).r2, "RESOURCES");
  assert.match(migration, /CREATE TABLE `members`/);
  assert.match(migration, /CREATE TABLE `episode_overrides`/);
  assert.match(vite, /binding: "ASSETS", run_worker_first: \["\/downloads\/\*"\]/);
  await assert.rejects(access(new URL("../app/_sites-preview", projectRoot)));
});

test("story imagery is responsive and all illustrated scenes are present", async () => {
  const [home, journey, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/journey/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(css, /img \{ max-width: 100%; height: auto;/);
  assert.match(home, /morning-transition[.]jpg/);
  assert.match(home, /peer-repair[.]jpg/);
  assert.match(home, /screen-transition[.]jpg/);
  assert.match(journey, /emotional-moments[.]webp/);
  for (const name of [
    "morning-transition.jpg",
    "peer-repair.jpg",
    "screen-transition.jpg",
    "spill-repair.webp",
    "private-correction.webp",
    "kerb-safety.webp",
    "emotional-moments.webp",
  ]) {
    await access(new URL(`../public/stories/${name}`, import.meta.url));
  }
});
