# Words Have Weather website prototype

Local, responsive landing-page prototype for the adult-facing Australian education-media project.

## What the page establishes

- core hook: **The rule can be right. The weather can still change.**
- primary promise: **Keep the boundary. Change the weather.**
- 35–45 second animated-short format;
- one story every second day, targeting 15 releases per month;
- the Pressure → Weather → Pause → Next sentence method;
- three interactive story previews covering home, safety and classroom use;
- three original story stills and one emotional-moments feature illustration;
- six research-led family pressure points and three age-specific content pathways;
- a twelve-story Season 1 shelf showing the next planned moments;
- a transparent evidence section with dated Australian sources and scope limits;
- the seven-character cast, including Arthur as a quiet community elder;
- distinct family and educator pathways;
- commercially neutral, adult-facing education positioning;
- local production status and review limitations.

## Current status

The page is a working local prototype. It is not published and does not collect contact information. Story copy remains in production-draft status until the project's education and safeguarding reviews are complete.

The production build and rendered-content checks pass. The social-preview card is stored at `public/og.png` and the canonical character artwork is stored at `public/character-lineup.png`.

The selected website illustrations and their generation prompts are recorded in `ILLUSTRATION_RECORD.md`. The current topic research and its editorial implications are recorded in `RESEARCH_NOTES.md`. Generated assets and story copy remain subject to the project’s normal visual-continuity, education, safeguarding and rights review before public release.

## Local commands

With Node.js 22.13 or later and pnpm available:

```bash
pnpm install
pnpm run dev
pnpm run build
node --test tests/rendered-html.test.mjs
```
