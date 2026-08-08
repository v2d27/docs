import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { ogCardConfig } from "./_og-card-config";
import { BLOGS } from "../../lib/blogs";

const docsEntries = await getCollection("docs", (entry) => !entry.data.draft);

const blogEntries = (
  await Promise.all(
    BLOGS.map((blog) => getCollection(blog.slug, (entry) => !entry.data.draft)),
  )
).flat();

const pages = Object.fromEntries([
  ...docsEntries.map(
    (entry) =>
      [
        entry.id,
        {
          title: entry.data.title,
          description: entry.data.description ?? "",
        },
      ] as const,
  ),
  // Blog posts key their OG card by `<blog>/<post>` so the served path
  // (`/og/<blog>/<post>.png`) matches the `socialImage` default every
  // src/pages/[blog]/[...slug].astro post falls back to.
  ...blogEntries.map(
    (entry) =>
      [
        `${entry.collection}/${entry.id}`,
        {
          title: entry.data.title,
          description: entry.data.description ?? "",
        },
      ] as const,
  ),
]);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    ...ogCardConfig,
  }),
});
