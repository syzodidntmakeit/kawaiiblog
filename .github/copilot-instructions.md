<!-- Copilot instructions for repository-specific AI coding tasks -->

# Copilot Instructions — KawaiiBlog 2.0

Purpose: give coding agents immediate, actionable context to work productively in this repository.

- **Big picture**: This is a static blog site built with Astro (`astro.config.mjs`) that renders Markdown posts stored under `src/content/posts/*`. The site is static (`output: 'static'`) and the build artifacts go to `dist/` via `npm run build`.
- **Runtime & tools**: Node.js (>=18) with `npm`; project uses `astro` (v5+), `tsx` for the CLI, and native ESM modules (`"type": "module"` in `package.json`).

- **Where content lives**: posts live in `src/content/posts/YYYY-MM-DD-slug/index.md`. Frontmatter is validated by `src/content/config.ts` (see `category` enum and required fields). Use the CLI to create consistent posts: `npm run cli new`.

- **Primary workflows / commands**:
  - Dev server: `npm run dev` (starts Astro; default port 4321)
  - Build: `npm run build` (produces `dist/`)
  - Preview production build: `npm run preview`
  - CLI manager: `npm run cli <command>` — wrapper for `tsx cli/kawaii-blog.ts`. Available subcommands: `new`, `list`, `search`, `edit` (implemented in `cli/commands/`).

- **Key integration points**:
  - CLI -> filesystem: `cli/commands/*` manipulate `src/content/posts/*` and use `utils/template-generator.ts` and `utils/image-optimizer.ts` to generate post content and optimize images (uses `sharp`). Keep file I/O safe and respect the existing folder naming convention `YYYY-MM-DD-slug`.
  - Search: client-side fuzzy search uses `fuse.js` and is fed by `src/pages/search-index.json.ts` (build-time generation). If you change how posts are indexed, update that file and the search component `src/components/SearchBar.astro`.
  - Astro config: `astro.config.mjs` declares `site`, `image` service (Sharp) and markdown/shiki settings — avoid breaking these without adjusting build expectations.

- **Project-specific conventions** (do not invent alternatives unless asked):
  - Post filenames: folder names MUST be `YYYY-MM-DD-slug` and contain `index.md` with YAML frontmatter matching `src/content/config.ts` schema.
  - Categories: limited to `['tech','music','games','commentary']` in `src/content/config.ts`. Add categories by editing that file and updating any UI that enumerates categories.
  - Frontmatter fields: `title`, `date` (YYYY-MM-DD), `category`, `excerpt`. Optional: `draft`, `featured`, `series` (object with `name` and `order`).
  - CLI expectations: the CLI assumes `process.cwd()` is project root and writes directly to `src/content/posts/*`. Tests or code should either mock FS or run in a temp directory.

- **Files of interest (quick map)**:
  - `package.json` — scripts and runtime deps (`astro`, `tsx`, `sharp`, `fuse.js`, `inquirer`).
  - `astro.config.mjs` — site/build configuration and image service.
  - `cli/kawaii-blog.ts` and `cli/commands/*.ts` — create/list/edit/search posts programmatically.
  - `utils/template-generator.ts` — canonical post template used by the CLI.
  - `utils/image-optimizer.ts` — image optimization logic (uses `sharp`) and destination: `src/content/posts/<post>/images/`.
  - `src/content/config.ts` — content schema (source of truth for frontmatter validation).
  - `src/pages/search-index.json.ts` and `src/components/SearchBar.astro` — search index generation + client-side search UI.

- **Testing / debugging tips**:
  - If you change the content schema or frontmatter, rebuild with `npm run dev` or `npm run build` to regenerate types/errors from `astro:content`.
  - To reproduce CLI issues locally, run `node --loader tsx cli/kawaii-blog.ts <command>` or simply `npm run cli <command>`; the CLI uses interactive prompts (`inquirer`).
  - If builds fail with unexpected Sharp/Go errors, try removing caches: `rm -rf node_modules .astro` (Windows: `Remove-Item -Recurse -Force node_modules,.astro`). Then `npm install` and `npm run build`.

- **Coding agent behavior / Do's and Don'ts**:
  - Do preserve the folder naming convention and frontmatter schema when creating or editing posts.
  - Do update `src/content/config.ts` if you intentionally add new frontmatter fields — and search for usages (components, templates, CLI) to update them too.
  - Do not change `astro.config.mjs` `image.service` entrypoint without verifying `sharp` compatibility.
  - When modifying the CLI, keep the `tsx` dev dependency in mind and maintain the `process.cwd()` assumptions.

If anything above is unclear or you want more details (CI, deployment secrets, or how the search index is structured), tell me which area to expand and I will update this file.
