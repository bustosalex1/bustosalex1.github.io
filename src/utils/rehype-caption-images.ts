import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * A Rehype plugin that takes images with captions (represented by the `title`
 * attribute on an `img` tag) and transforms them into `figure` with `img` and
 * `figcaption` child elements.
 */
export default function rehypeCaptionImages() {
    return (tree: Root) => {
        visit(tree, "element", (node, index, parent) => {
            if (node.tagName === "img" && node.properties?.title) {
                const figureNode: Element = {
                    type: "element",
                    tagName: "figure",
                    properties: {},
                    children: [
                        {
                            type: "element",
                            tagName: "img",
                            properties: {
                                src: node.properties.src,
                                alt: node.properties.alt || "",
                            },
                            children: [],
                        },
                        {
                            type: "element",
                            tagName: "figcaption",
                            properties: {},
                            children: [
                                {
                                    type: "text",
                                    value: node.properties.title as string,
                                },
                            ],
                        },
                    ],
                };
                if (parent !== undefined && index !== undefined) {
                    parent.children[index] = figureNode;
                }
            }
        });
    };
}
