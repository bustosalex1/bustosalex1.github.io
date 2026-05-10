const utc = { timeZone: "UTC" } as const;
const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString("en-US", { ...utc, ...opts });

export function formatDateRange(
    start: Date,
    end?: Date,
    yearOnly?: boolean,
): string {
    const startYear = start.getUTCFullYear();

    if (yearOnly) {
        if (end && end.getUTCFullYear() !== startYear) {
            return `${startYear} – ${end.getUTCFullYear()}`;
        }
        return `${startYear}`;
    }

    if (!end) return fmt(start, { month: "short", day: "numeric", year: "numeric" });

    const endYear = end.getUTCFullYear();
    const startMD = fmt(start, { month: "short", day: "numeric" });

    if (startYear !== endYear) {
        return `${fmt(start, { month: "short", day: "numeric", year: "numeric" })} – ${fmt(end, { month: "short", day: "numeric", year: "numeric" })}`;
    }

    if (start.getUTCMonth() === end.getUTCMonth()) {
        return `${startMD} – ${end.getUTCDate()}, ${endYear}`;
    }

    return `${startMD} – ${fmt(end, { month: "short", day: "numeric", year: "numeric" })}`;
}
