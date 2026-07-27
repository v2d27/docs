# docs

Documentation site built with [Astro](https://astro.build) and [Nimbus Docs](https://nimbus-docs.com), deployed to Cloudflare Workers.

**Live:** [https://docs.ducduc08.workers.dev](https://docs.ducduc08.workers.dev)

## Getting started

```sh
pnpm install
pnpm dev
```

## Scripts

| Command | Action |
| --- | --- |
| `pnpm dev` | Start the local dev server |
| `pnpm build` | Build the production site to `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm typecheck` | Run `astro check` |
| `pnpm lint:docs` | Lint docs content (`nimbus-docs lint`) |
| `pnpm lint:docs:fix` | Lint and auto-fix docs content |
| `pnpm preview:cf` | Build and preview via `wrangler dev` |
| `pnpm deploy` | Build and deploy via `wrangler deploy` |

## Writing docs

Add pages under `src/content/docs/*.mdx`. Frontmatter requires at minimum a `title`. See [AGENT.md](./AGENT.md) for the full file layout, authoring rules, and site audit checklist.

## Deployment

Deployed to Cloudflare Workers via `wrangler.jsonc`. Run `pnpm deploy` to build and publish.
