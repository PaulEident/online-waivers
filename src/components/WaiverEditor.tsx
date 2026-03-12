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
    immediatelyRender: false,
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

  // Close variable dropdown when clicking outside
  useEffect(() => {
    if (!showVariables) return;
    const handleClickOutside = () => setShowVariables(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showVariables]);

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
            onClick={(e) => {
              e.stopPropagation();
              setShowVariables(!showVariables);
            }}
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
