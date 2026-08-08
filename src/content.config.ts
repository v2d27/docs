import { defineCollection } from "astro:content";
// `z` re-exported from `astro:content` is deprecated; import it from
// `astro/zod` (the pattern nimbus-docs' own schema helpers document).
import { z } from "astro/zod";
import { docsCollection, partialsCollection } from "@cloudflare/nimbus-docs/content";
import { BLOGS, type BlogConfig } from "./lib/blogs";

// Every blog is a full docs-shaped tree (same schema as `docs` below) —
// that's what gives it a sidebar, nested pages, and prev/next for free.
function blogCollection(slug: string) {
  return defineCollection(docsCollection({ base: slug }));
}

// Builds one collection entry per `BLOGS` item, keyed by literal `slug`.
// A plain `Object.fromEntries`/`reduce` here collapses to `{ [k: string]: V }`
// — Astro's static content-schema inference resolves collection types via
// `keyof` on the *literal* shape of this module's `collections` export, so a
// widened string index makes every blog's `entry.data` type `unknown`. The
// mapped type below (`as` clause) is what TypeScript actually preserves
// literal keys through — this is the one part of `BLOGS` → `collections`
// that has to be a type-level construct, not a runtime loop, to keep both
// full dynamism (no manual per-blog line here) and full typing.
type BlogCollections<T extends readonly BlogConfig[]> = {
  [B in T[number] as B["slug"]]: ReturnType<typeof blogCollection>;
};

function blogCollections<T extends readonly BlogConfig[]>(blogs: T): BlogCollections<T> {
  const result: Record<string, ReturnType<typeof blogCollection>> = {};
  for (const blog of blogs) result[blog.slug] = blogCollection(blog.slug);
  return result as BlogCollections<T>;
}

export const collections = {
  docs: defineCollection(
    docsCollection({
      schemaFields: {
        // Nimbus docs are agent-friendly by default. Set `audience: human`
        // to flag a page that's written primarily for human readers.
        audience: z.literal("human").optional(),
      },
    }),
  ),
  partials: defineCollection(partialsCollection()),
  // Fully driven by src/lib/blogs.ts — add a blog there and a content
  // folder, nothing here needs to change.
  ...blogCollections(BLOGS),
};
