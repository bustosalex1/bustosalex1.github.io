import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * A Rehype plugin that takes tables with italic text over them and transforms
 * them into a table with a caption.
 */
export default function rehypeCaptionTables() {
    return (tree: Root) => {
        visit(tree, "element", (node, index, parent) => {
            if (
                node.tagName !== "table" ||
                index === undefined ||
                parent === undefined ||
                index === 0
            )
                return;

            // find the previous element sibling
            let prevIndex = index - 1;
            while (
                prevIndex >= 0 &&
                parent.children[prevIndex].type !== "element"
            ) {
                prevIndex--;
            }

            if (prevIndex < 0) return;

            const prev = parent.children[prevIndex];

            // if it's not a `p` tag, do nothing.
            if (prev.type !== "element") return;

            if (prev.tagName !== "p") return;

            // if there's no `em` tag inside the `p` tag, do nothing.
            const elementChildren = prev.children.filter(
                (c) => c.type === "element",
            );

            if (elementChildren.length !== 1) return;
            const contents = elementChildren[0];
            if (contents.tagName !== "em") {
                return;
            }

            // make a caption with the contents of the <p><em>...</p></em>
            const caption: Element = {
                type: "element",
                tagName: "caption",
                properties: {},
                children: contents.children,
            };

            // remove the <p> element from the parent.
            parent.children.splice(prevIndex, 1);

            // insert the caption into the table node
            node.children.unshift(caption);

            // continue from `prevIndex` because removing the `p` node shifted
            // everything back one.
            return prevIndex;
        });
    };
}
