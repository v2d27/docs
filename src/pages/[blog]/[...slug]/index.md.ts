/**
 * Per-page /<blog>/<slug>/index.md — clean markdown alternate, shared
 * across every registered blog (src/lib/blogs.ts). Mirrors the primary
 * .md alternate at src/pages/[...slug]/index.md.ts, including the
 * `index` id → blog root convention (e.g. `/blog/index.md`, not
 * `/blog/index/index.md`).
 */

import { getIndexedEntries, renderEntryAsMarkdown, type IndexedEntry } from "@cloudflare/nimbus-docs";
import { config } from "virtual:nimbus/config";
import { BLOGS } from "../../../lib/blogs";

export const prerender = true;

const BLOG_SLUGS = new Set<string>(BLOGS.map((blog) => blog.slug));

interface SlugProps {
  item: IndexedEntry;
}

export async function getStaticPaths() {
  const indexed = await getIndexedEntries();
  return indexed
    .filter((item) => BLOG_SLUGS.has(item.collection))
    .map((item) => ({
      params: {
        blog: item.collection,
        slug: item.entry.id === "index" ? undefined : item.entry.id,
      },
      props: { item } as SlugProps,
    }));
}

export async function GET({ props }: { props: SlugProps }) {
  const { item } = props;
  const { entry, title, description, sourceUrl, markdownUrl } = item;
  const data = (entry.data ?? {}) as Record<string, unknown>;
  const rawImage = data.socialImage;
  const socialImage =
    typeof rawImage === "string" && rawImage.length > 0
      ? rawImage
      : config.socialImage;

  const markdown = renderEntryAsMarkdown(entry);

  const body = [
    "---",
    `title: ${JSON.stringify(title)}`,
    ...(description ? [`description: ${JSON.stringify(description)}`] : []),
    ...(socialImage
      ? [`image: ${JSON.stringify(new URL(socialImage, config.site).href)}`]
      : []),
    "---",
    "",
    "> Documentation Index",
    `> Fetch the complete documentation index at: ${new URL("/llms.txt", config.site).href}`,
    "> Use this file to discover all available pages before exploring further.",
    "",
    `# ${title}`,
    "",
    markdown,
    "",
    `Source: ${new URL(sourceUrl ?? markdownUrl, config.site).href}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
