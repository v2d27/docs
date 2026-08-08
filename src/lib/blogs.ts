/**
 * Registry of blogs on this site — the single source of truth for
 * multi-blog support.
 *
 * Each "blog" is a full, independent docs-shaped tree: many pages, its
 * own sidebar (with nested folders/groups, same as `docs`), and
 * prev/next navigation between its own pages — the same experience as
 * the primary `docs` collection, just mounted at its own URL prefix
 * instead of root. Think "another parallel docs tree, named instead of
 * versioned" rather than a dated post feed.
 *
 * `slug` is the sanitized blog name: it doubles as the Astro content
 * collection name (`src/content/<slug>/`) AND the URL prefix
 * (`/<slug>/<page-slug>/`), because nimbus-docs' own collection-mount
 * convention ties a collection's canonical URL directly to its name
 * (see `collectionMountPrefix` in `@cloudflare/nimbus-docs`). Keeping
 * them identical here is what makes llms.txt, sitemaps, canonical
 * links, and OG cards resolve correctly with zero extra config.
 *
 * To add a new blog:
 *   1. Add an entry here.
 *   2. Create `src/content/<slug>/index.mdx` (the blog's landing page,
 *      mounted at `/<slug>/`) plus any other pages.
 *
 * That's it — this is the only place a new blog is registered.
 * `content.config.ts`'s collections, `astro.config.ts`'s sidebar, and
 * every `src/pages/[blog]/*` route all derive from this list at the
 * type level (see the `BlogCollections` mapped type in
 * `content.config.ts` for how the collection registration stays fully
 * typed without a manual per-blog line there).
 *
 * `slug` must be lowercase, contain only `a-z0-9-_`, and must not be
 * `docs` or `partials` (reserved by nimbus-docs).
 *
 * Known quirk: a *brand-new* blog with only its `index.mdx` and no
 * other pages yet won't scope its sidebar correctly (nimbus-docs'
 * `scope: "section"` falls back to showing the whole site tree until
 * a second page exists in that collection). Add a second page and it
 * resolves itself — not something to work around here.
 */
export interface BlogConfig {
  slug: string;
  title: string;
  description?: string;
}

// `as const satisfies` (rather than an explicit `BlogConfig[]` annotation)
// keeps each `slug` a string *literal* instead of widening to `string` —
// required for `getCollection(blog.slug)` to type-check against Astro's
// generated `DataEntryMap` everywhere this list is iterated directly.
export const BLOGS = [
  {
    slug: "engineering",
    title: "Engineering",
    description: "Architecture notes and technical deep dives.",
  },
  {
    slug: "product",
    title: "Product",
    description: "Feature announcements and release notes.",
  },
  {
    slug: "community",
    title: "Community",
    description: "Contributor spotlights and community news.",
  },
] as const satisfies BlogConfig[];

export type BlogSlug = (typeof BLOGS)[number]["slug"];
