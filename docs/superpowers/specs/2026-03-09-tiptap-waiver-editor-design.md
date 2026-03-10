# TipTap Rich Text Waiver Editor

**Date:** 2026-03-09
**Status:** Approved

## Problem

Waiver templates are edited in plain `<textarea>` fields where admins must write raw HTML. The target users are non-technical admins who need a toolbar-based WYSIWYG editing experience.

## Decision

Replace the plain textarea with a TipTap-based rich text editor. TipTap is a headless React editor built on ProseMirror that outputs HTML — fitting directly into the existing sanitization and rendering pipeline with no backend changes.

Alternatives considered:
- **TinyMCE:** Heavier bundle, requires API key or self-hosting, jQuery-era architecture feels foreign in Next.js/Tailwind.
- **CKEditor 5:** GPL license requires open-sourcing the app or purchasing a commercial license. Heavier than TipTap with complex build configuration.

## Design

### New Component: `WaiverEditor`

A reusable `<WaiverEditor>` component used in both the org settings page and the event waiver template editor.

**Props:**
- `content: string` — initial HTML content
- `onChange: (html: string) => void` — callback when content changes
- `editable?: boolean` — defaults to `true`, set `false` for locked state (event with signed waivers)

**Toolbar:**
- Bold, Italic, Underline
- Headings (H3, H4 — appropriate for waiver document sections)
- Bullet list, Ordered list
- "Insert Variable" dropdown menu with: `{{ORG_NAME}}`, `{{EVENT_NAME}}`, `{{EVENT_DATE}}`, `{{EVENT_LOCATION}}`, `{{YEAR}}`

**Styling:**
- Editor area matches the current Tailwind design (border, rounded corners, consistent padding)
- Toolbar uses simple icon buttons above the editor
- Disabled/locked state uses TipTap's `editable: false` and visually grays out the toolbar

### Data Flow (unchanged)

1. Admin edits content in TipTap → outputs HTML string
2. On save, HTML passes through existing `sanitizeHtml()` function
3. Stored in `waiverTemplate` field (`String @db.Text`) on Organization or Event
4. On render to signers, template variables are interpolated with proper escaping, then sanitized again before rendering

No changes to the database schema, sanitization logic, template variable interpolation, or signer-facing rendering. All HTML is sanitized via the existing `sanitize-html` library before storage and before rendering.

### Dependencies

- `@tiptap/react` — React bindings
- `@tiptap/starter-kit` — bundles bold, italic, headings, lists, paragraph, etc.
- `@tiptap/extension-underline` — underline support (not in starter-kit)

### Files

| File | Action | Description |
|------|--------|-------------|
| `src/components/WaiverEditor.tsx` | Create | TipTap editor component with toolbar and variable insert |
| `src/app/admin/org/[orgId]/settings/page.tsx` | Edit | Replace textarea with `<WaiverEditor>` |
| `src/components/EventWaiverTemplateEditor.tsx` | Edit | Replace textarea with `<WaiverEditor>` |

### What Stays the Same

- Database schema (no migrations)
- `sanitizeHtml()` and `escapeHtml()` in `src/lib/sanitize.ts`
- Template variable interpolation in the event page
- Waiver rendering to signers (sanitized before display)
- Lock logic preventing edits after first waiver is signed
- All server actions (`updateOrganization`, `updateEventWaiverTemplate`)
