/**
 * Format event date(s) for display.
 * Single day: "Saturday, March 14, 2026"
 * Multi-day same month: "March 14 – 16, 2026"
 * Multi-day different months: "March 14 – April 2, 2026"
 * Multi-day different years: "December 30, 2026 – January 2, 2027"
 */
export function formatEventDate(
  startDate: Date | string | null | undefined,
  endDate?: Date | string | null | undefined,
  options?: { short?: boolean }
): string {
  if (!startDate) return "No date set";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (!end || start.toDateString() === end.toDateString()) {
    // Single day
    if (options?.short) {
      return start.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return start.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Multi-day
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();

  if (sameMonth) {
    const month = start.toLocaleDateString("en-US", { month: "long" });
    return `${month} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
  }

  if (sameYear) {
    const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    const endStr = end.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    return `${startStr} – ${endStr}, ${start.getFullYear()}`;
  }

  const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return `${startStr} – ${endStr}`;
}

/**
 * Format event date for waiver template variables.
 * Returns a concise date string or range.
 */
export function formatEventDateForTemplate(
  startDate: Date | string | null | undefined,
  endDate?: Date | string | null | undefined
): string {
  if (!startDate) return "TBD";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString();
  }

  return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
}
