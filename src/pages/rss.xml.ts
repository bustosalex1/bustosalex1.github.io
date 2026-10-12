import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from "astro:content";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMdxContainerRenderer } from "@astrojs/mdx/container-renderer";
import { getContainerRenderer as getSvelteContainerRenderer } from "@astrojs/svelte/container-renderer";
import { ELEMENT_NODE, transform, walkSync } from "ultrahtml";
import type { ElementNode } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";

const RELATIVE_ATTRIBUTES: Record<string, string[]> = {
    a: ["href"],
    img: ["src", "srcset"],
    source: ["src", "srcset"],
    video: ["src", "poster"],
};

function absolutizeSrcset(srcset: string, baseUrl: string): string {
    return srcset
        .split(",")
        .map((candidate) => {
            const [url, ...descriptors] = candidate.trim().split(/\s+/);
            const absolute = url.startsWith("/") ? baseUrl + url : url;
            return [absolute, ...descriptors].join(" ");
        })
        .join(", ");
}

export async function GET(context: APIContext) {
    const site = context.site ?? new URL("https://alexbustos.com");
    const baseUrl = site.href.replace(/\/$/, "");

    const renderers = await loadRenderers([
        getMdxContainerRenderer(),
        getSvelteContainerRenderer(),
    ]);
    const container = await AstroContainer.create({ renderers });

    const posts = await getCollection("posts");
    const bookNotes = await getCollection("books");

    const sortedEntries = [...posts, ...bookNotes].sort(
        (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
    );

    const items: RSSFeedItem[] = [];
    for (const entry of sortedEntries) {
        const { Content } = await render(entry);
        const html = await container.renderToString(Content);

        const content = await transform(html.replace(/^<!DOCTYPE html>/, ""), [
            (root) => {
                const removals: Array<{
                    parent: ElementNode;
                    node: ElementNode;
                }> = [];
                walkSync(root, (node, parent) => {
                    if (node.type !== ELEMENT_NODE) return;

                    if (
                        node.name === "span" &&
                        node.attributes.class
                            ?.split(/\s+/)
                            .includes("katex-html") &&
                        parent?.type === ELEMENT_NODE
                    ) {
                        removals.push({ parent, node });
                        return;
                    }

                    const attributes = RELATIVE_ATTRIBUTES[node.name];
                    if (!attributes) return;
                    for (const attribute of attributes) {
                        const value = node.attributes[attribute];
                        if (!value) continue;
                        if (attribute === "srcset") {
                            node.attributes[attribute] = absolutizeSrcset(
                                value,
                                baseUrl,
                            );
                        } else if (
                            value.startsWith("/") &&
                            !value.startsWith("//")
                        ) {
                            node.attributes[attribute] = baseUrl + value;
                        }
                    }
                });
                for (const { parent, node } of removals) {
                    parent.children = parent.children.filter(
                        (child) => child !== node,
                    );
                }
                return root;
            },
            sanitize({ dropElements: ["script", "style", "iframe"] }),
        ]);

        items.push({
            title: entry.data.title,
            description:
                entry.collection === "posts"
                    ? entry.data.description
                    : undefined,
            pubDate: entry.data.pubDate,
            link:
                entry.collection === "posts"
                    ? `/posts/${entry.id}/`
                    : `/experiments/books/${entry.id}/`,
            categories: entry.data.tags,
            content,
        });
    }

    return rss({
        title: "Alex Bustos",
        description: "Alex Bustos's personal website.",
        site,
        items,
        xmlns: { atom: "http://www.w3.org/2005/Atom" },
        customData: `<language>en-us</language><atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />`,
    });
}
