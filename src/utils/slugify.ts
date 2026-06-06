/** Converts a string to a URL-safe slug: lowercase, spaces replaced with hyphens. */
export function slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, "-");
}
