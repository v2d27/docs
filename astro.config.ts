import { defineConfig } from "astro/config";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import nimbus, { defineConfig as defineNimbusConfig } from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";
import { BLOGS } from "./src/lib/blogs";

const nimbusConfig = defineNimbusConfig({
  // CHANGE_ME: your site's canonical origin (no trailing slash). Drives
  // canonical URLs, absolute OG image URLs, robots.txt, sitemap, and the
  // links in /llms.txt — leaving the placeholder breaks all of them.
  site: "https://docs.ducduc08.workers.dev/",
  // CHANGE_ME: your project's name — used for <title>, the home H1, and OG.
  title: "Hercules Docs",
  // CHANGE_ME: a one-line description of your docs — used for meta + OG.
  description: "Hercules documentation and reference",
  locale: "en",
  github: "https://github.com/v2d27/docs",
  editPattern: "https://github.com/v2d27/docs/edit/main/{path}",
  socialImageAlt: "Hercules document preview",
  sidebar: {
    items: [
      // Must be labelled — `scope: "section"` identifies "the current
      // section" by walking top-level *group* nodes (see nimbus-docs'
      // `scopeToCurrentSection`). A label-less autogenerate pushes docs
      // pages in as flat, ungrouped links instead of one group, so on a
      // docs page nothing matches and it falls back to rendering the
      // WHOLE tree — every blog's posts leaking into the docs sidebar.
      // Labelling it fixes that; it still never joins the header's
      // cross-section tab strip (a separate nimbus-docs convention: the
      // root-mounted primary collection has no URL prefix of its own).
      { label: "Docs", autogenerate: { collection: "docs" } },
      // One entry per registered blog (src/lib/blogs.ts) — each becomes
      // its own top-level section with its own scoped sidebar. Once a
      // second blog (or any other secondary collection) is registered,
      // the header's tab strip automatically shows a tab per blog.
      ...BLOGS.map((blog) => ({
        label: blog.title,
        autogenerate: { collection: blog.slug },
      })),
    ],
    // Each section (docs, every blog) rails off the others — a blog's
    // sidebar only shows that blog's posts, not every other section's
    // tree too. Cross-section nav lives in the header tab strip instead.
    scope: "section",
  },
});

export default defineConfig({
  output: "static",
  // Tailwind v4 via its Vite plugin (the integration Astro recommends for
  // Tailwind v4 — replaces the PostCSS plugin, which doesn't build under
  // Astro 7's Vite 8 bundler).
  vite: {
    plugins: [tailwindcss()],
  },
  // Hover-prefetch link targets so full-page navigations feel instant without
  // a client-side router.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    icon(),
    nimbus(nimbusConfig, {
      // Authoring rules are opt-in by design — your repo, your taste. The
      // two below are the load-bearing pair: frontmatter has to validate
      // against the content schema for the page to render properly, and
      // broken internal links are 404s for your readers. Add the others
      // (heading hierarchy, code-block language, style, etc.) when you're
      // ready to enforce them — see `nimbus-docs lint --help`.
      rules: {
        "nimbus/frontmatter-shape": "error",
        "nimbus/internal-link": "error",
      },
      // Wrap wide tables so they scroll instead of overflowing the page
      // (styled by `.nb-table-scroll` in src/styles/prose.css).
      markdown: {
        hastPlugins: [tableScroll()],
      },
    }),
  ],
});
