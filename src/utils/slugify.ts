/** Converts a string to a URL-safe slug: lowercase, Unicode normalized,
 *  spaces and special characters replaced with hyphens, and trimmed. */
export function slugify(str: string): string {
    return str
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]+/g, "-")
        .replace(/[\s-]+/g, "-")
        .replace(/^-|-$/g, "");
}
