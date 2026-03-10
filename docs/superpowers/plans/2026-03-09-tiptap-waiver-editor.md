# TipTap Rich Text Waiver Editor — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain textarea waiver template editors with a TipTap WYSIWYG rich text editor, including a toolbar with formatting buttons and a variable-insert dropdown.

**Architecture:** A single reusable `WaiverEditor` client component wraps TipTap with a custom toolbar. It accepts `content` (HTML string) and `onChange` callback, outputting HTML that flows through the existing `sanitizeHtml()` pipeline unchanged. The component replaces the `<textarea>` in both the org settings page and the event waiver template editor.

**Tech Stack:** TipTap (ProseMirror), React 19, Next.js 16, Tailwind CSS 4, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-09-tiptap-waiver-editor-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/WaiverEditor.tsx` | Create | TipTap editor with toolbar, variable insert dropdown, locked state |
| `src/app/admin/org/[orgId]/settings/page.tsx` | Modify (lines 83-101) | Swap textarea for `<WaiverEditor>` |
| `src/components/EventWaiverTemplateEditor.tsx` | Modify (lines 56-70) | Swap textarea + variable help text for `<WaiverEditor>` |

**Unchanged files:** `src/lib/sanitize.ts`, `src/lib/actions.ts`, `prisma/schema.prisma`, all signer-facing pages.

---

## Chunk 1: Dependencies and WaiverEditor Component

### Task 1: Install TipTap dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install TipTap packages**

Run:
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline @tiptap/pm
```

- [ ] **Step 2: Verify installation**

Run:
```bash
node -e "require('@tiptap/react'); require('@tiptap/starter-kit'); require('@tiptap/extension-underline'); console.log('OK')"
```
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add TipTap rich text editor dependencies"
```

---

### Task 2: Create WaiverEditor component

**Files:**
- Create: `src/components/WaiverEditor.tsx`

- [ ] **Step 1: Create the WaiverEditor component**

Create `src/components/WaiverEditor.tsx` with the following:

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useState, useCallback, useEffect } from "react";

const TEMPLATE_VARIABLES = [
  { label: "Organization Name", value: "{{ORG_NAME}}" },
  { label: "Event Name", value: "{{EVENT_NAME}}" },
  { label: "Event Date", value: "{{EVENT_DATE}}" },
  { label: "Event Location", value: "{{EVENT_LOCATION}}" },
  { label: "Year", value: "{{YEAR}}" },
];

interface WaiverEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
        active
          ? "bg-brand text-white"
          : "bg-white text-gray-700 hover:bg-gray-100"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function WaiverEditor({
  content,
  onChange,
  editable = true,
}: WaiverEditorProps) {
  const [showVariables, setShowVariables] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
      }),
      Underline,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
  });

  // Update editable state if prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  const insertVariable = useCallback(
    (variable: string) => {
      if (editor) {
        editor.chain().focus().insertContent(variable).run();
      }
      setShowVariables(false);
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-md p-4 min-h-[300px] bg-gray-50 animate-pulse" />
    );
  }

  return (
    <div
      className={`border border-gray-300 rounded-md overflow-hidden ${
        !editable ? "opacity-60" : ""
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-2 bg-gray-50 border-b border-gray-300">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          disabled={!editable}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          disabled={!editable}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          disabled={!editable}
          title="Underline"
        >
          <u>U</u>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          disabled={!editable}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          active={editor.isActive("heading", { level: 4 })}
          disabled={!editable}
          title="Heading 4"
        >
          H4
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          disabled={!editable}
          title="Bullet List"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          disabled={!editable}
          title="Ordered List"
        >
          1. List
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Variable Insert Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowVariables(!showVariables)}
            disabled={!editable}
            className="px-2 py-1 text-sm font-medium rounded bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Insert Variable"
          >
            {"{ } Variable ▾"}
          </button>
          {showVariables && editable && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[200px]">
              {TEMPLATE_VARIABLES.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => insertVariable(v.value)}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">{v.label}</span>
                  <span className="text-gray-400 ml-2 text-xs">{v.value}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
```

- [ ] **Step 2: Verify the file was created correctly**

Run:
```bash
ls -la src/components/WaiverEditor.tsx
```
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add src/components/WaiverEditor.tsx
git commit -m "feat: create WaiverEditor component with TipTap rich text toolbar"
```

---

## Chunk 2: Integration into Existing Pages

### Task 3: Replace textarea in org settings page

**Files:**
- Modify: `src/app/admin/org/[orgId]/settings/page.tsx` (lines 83-101)

- [ ] **Step 1: Add the WaiverEditor import**

At top of file, add:
```tsx
import WaiverEditor from "@/components/WaiverEditor";
```

- [ ] **Step 2: Replace the textarea section with WaiverEditor**

Replace lines 83-101 (the entire `<div className="bg-white rounded-lg shadow p-6">` block containing the waiver textarea) with:

```tsx
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Default Waiver Template</h2>
            <p className="text-sm text-gray-500 mb-3">
              This template is used as the starting point when creating new events. Each event gets its own copy that can be customized.
            </p>
            <WaiverEditor
              content={waiverTemplate}
              onChange={setWaiverTemplate}
            />
          </div>
```

This removes:
- The "Available variables" help text (now handled by the toolbar dropdown)
- The `<textarea>` element (replaced by `<WaiverEditor>`)

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/org/[orgId]/settings/page.tsx
git commit -m "feat: use WaiverEditor in org settings page"
```

---

### Task 4: Replace textarea in EventWaiverTemplateEditor

**Files:**
- Modify: `src/components/EventWaiverTemplateEditor.tsx` (lines 56-70)

- [ ] **Step 1: Add the WaiverEditor import**

At top of file, add:
```tsx
import WaiverEditor from "@/components/WaiverEditor";
```

- [ ] **Step 2: Replace the "Available variables" text and textarea**

Replace lines 56-70 (the `<p>` with variable help text and the `<textarea>`) with:

```tsx
      <WaiverEditor
        content={value}
        onChange={setValue}
        editable={!locked}
      />
```

This removes:
- The "Available variables" help text (now handled by the toolbar dropdown)
- The `<textarea>` element (replaced by `<WaiverEditor>`)

The `editable={!locked}` prop replaces the textarea's `disabled={locked}` — TipTap will show a grayed-out, non-editable editor when waivers have been signed.

- [ ] **Step 3: Commit**

```bash
git add src/components/EventWaiverTemplateEditor.tsx
git commit -m "feat: use WaiverEditor in event waiver template editor"
```

---

## Chunk 3: Verify and Close Variable Dropdown

### Task 5: Manual verification and close-dropdown UX fix

- [ ] **Step 1: Start the dev server and verify**

Run the dev server (via Docker or locally) and verify:
1. Navigate to `/admin/org/[orgId]/settings` — editor loads with existing template HTML rendered as rich text
2. Bold, italic, underline, headings, lists all work from toolbar
3. "Variable" dropdown inserts template variables at cursor position
4. Content saves correctly (save, refresh, content persists)
5. Navigate to an event detail page — editor loads with event template
6. If event has signed waivers, editor is disabled (grayed out, toolbar buttons disabled)
7. "Reset to Org Default" still works (resets editor content)
8. Waiver renders correctly to signers at `/events/[orgSlug]/[eventSlug]`

- [ ] **Step 2: Add click-outside handler to close variable dropdown**

In `WaiverEditor.tsx`, the variable dropdown should close when clicking outside it. Add a click-outside effect:

After the existing `useEffect` for editable, add:

```tsx
  // Close variable dropdown when clicking outside
  useEffect(() => {
    if (!showVariables) return;
    const handleClickOutside = () => setShowVariables(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showVariables]);
```

And on the variable dropdown button, add `e.stopPropagation()`:

```tsx
  onClick={(e) => {
    e.stopPropagation();
    setShowVariables(!showVariables);
  }}
```

- [ ] **Step 3: Final commit**

```bash
git add src/components/WaiverEditor.tsx
git commit -m "fix: close variable dropdown when clicking outside"
```
