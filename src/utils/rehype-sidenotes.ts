import { visit, SKIP } from "unist-util-visit";
import type { Element, Root } from "hast";

/**
 * A Rehype plugin that transforms GFM footnotes into inline sidenotes on wider
 * screens.
 */
export default function rehypeSidenotes() {
    return (tree: Root) => {
        const definitions = new Map<string, Element>();
        const footnotesSections: Element[] = [];

        // Find and collect all the footnotes into `definitions`. Also,
        // identify the footnotes section. It seems easier to just do this as a
        // list, since TS doesn't seem to recognize variable assignment inside
        // a callback.
        visit(tree, "element", (node) => {
            if (
                node.tagName !== "section" ||
                node.properties.dataFootnotes === undefined
            )
                return;
            footnotesSections.push(node);
            visit(node, "element", (child) => {
                if (
                    child.tagName === "li" &&
                    typeof child.properties.id === "string"
                ) {
                    definitions.set(child.properties.id, child);
                }
            });
            return SKIP;
        });

        // if there are no footnotes, we can dip early.
        if (!definitions.size) return;

        const placed = new Set<string>();
        // Find references throughout the document.
        visit(tree, "element", (sup, index, parent) => {
            // skip the actual footnotes section, and do not visit descendants.
            if (footnotesSections.includes(sup)) return SKIP;

            // do more filtering to skip nodes that are not footnote
            // references.
            if (sup.tagName !== "sup" || !parent || index === undefined) return;
            const referenceLink = sup.children.find(
                (child): child is Element =>
                    child.type === "element" &&
                    child.tagName === "a" &&
                    child.properties.dataFootnoteRef !== undefined,
            );
            if (
                !referenceLink ||
                typeof referenceLink.properties.href !== "string"
            )
                return;

            // remove leading `#`
            const id = referenceLink.properties.href.slice(1);
            const definition = definitions.get(id);
            if (!definition) return;
            const sidenoteId = `sidenote-${id}`;
            const number = referenceLink.children
                .filter((c) => c.type === "text")
                .map((c) => c.value)
                .join("");

            // create a new link to point to the sidenote.
            const sidenoteLink = structuredClone(referenceLink);
            delete sidenoteLink.properties.id;
            delete sidenoteLink.properties.dataFootnoteRef;
            delete sidenoteLink.properties.ariaDescribedBy;
            sidenoteLink.properties.href = `#${sidenoteId}`;
            sidenoteLink.properties.className = ["sidenote-reference"];
            sidenoteLink.properties.ariaLabel = `Read sidenote ${number}`;

            // Both versions share a single backlink target, including
            // repeated references.
            const referenceId = referenceLink.properties.id;
            delete referenceLink.properties.id;
            referenceLink.properties.className = ["footnote-reference"];
            sup.children = [referenceLink, sidenoteLink];
            const wrapper: Element = {
                type: "element",
                tagName: "span",
                properties: {
                    id: referenceId,
                    tabIndex: -1,
                    className: ["sidenote-wrapper"],
                },
                children: [sup],
            };
            parent.children[index] = wrapper;

            if (placed.has(id)) return SKIP;
            placed.add(id);
            const note = structuredClone(definition);
            note.tagName = "span";
            note.properties = {
                id: sidenoteId,
                className: ["sidenote"],
                role: "note",
                ariaLabel: `Sidenote ${number}`,
            };
            // Notes contain text, links, and emphasis. Unwrap GFM's <p> so the
            // note can sit inline beside its reference.
            note.children = note.children
                .flatMap((child) =>
                    child.type === "element" && child.tagName === "p"
                        ? child.children
                        : [child],
                )
                .filter((child) => {
                    return !(
                        child.type === "element" &&
                        child.properties.dataFootnoteBackref !== undefined
                    );
                });

            // copy in the number from the reference link.
            note.children.unshift({
                type: "element",
                tagName: "span",
                properties: {
                    className: ["sidenote-number"],
                    ariaHidden: "true",
                },
                children: structuredClone(referenceLink.children),
            });
            wrapper.children.push(note);
            return SKIP;
        });

        // add `sidenote-footnotes` class to footnotes section
        for (const section of footnotesSections) {
            section.properties.className = [
                ...((section.properties.className as string[] | undefined) ??
                    []),
                "sidenote-footnotes",
            ];
        }
    };
}
