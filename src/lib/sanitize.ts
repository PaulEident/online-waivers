import sanitize from "sanitize-html";

// Allowlist of safe HTML tags for waiver templates
const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "strong", "em", "b", "i", "u",
  "ul", "ol", "li",
  "table", "thead", "tbody", "tr", "th", "td",
  "blockquote", "pre", "code",
  "span", "div",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  "*": ["class", "style"],
};

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Only allows safe formatting tags — strips all scripts, event handlers,
 * iframes, forms, and other dangerous elements.
 */
export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });
}

/**
 * Escape a string for safe insertion into HTML.
 * Used for template variable interpolation (e.g., event names, org names)
 * to prevent XSS via user-controlled database values.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
