"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";

type RichTextEditorProps = {
  // Markdown loaded when this editor is first opened.
  initialContent: string;

  // Send updated Markdown back to PostForm for saving.
  onChange: (markdown: string) => void;
};

export function RichTextEditor({
  initialContent,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Offer two heading levels suitable for blog content.
        heading: {
          levels: [2, 3],
        },

        // Standard Markdown does not support underline.
        underline: false,

        // Clicking a link while editing should not leave the form.
        link: {
          openOnClick: false,
        },
      }),
      Markdown,
    ],

    // Read existing blog content as Markdown.
    content: initialContent,
    contentType: "markdown",

    // Initialize after hydration to support Next.js rendering.
    immediatelyRender: false,

    // Refresh toolbar highlights when formatting or selection changes.
    shouldRerenderOnTransaction: true,

    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": "Rich text content",
        "aria-multiline": "true",
        "data-test-id": "rich-text-editor",

        // Style the editable content without another CSS dependency.
        class: [
          "min-h-72 px-4 py-4 text-gray-900 leading-7",
          "outline-none",
          "[&_p]:my-2",
          "[&_h2]:mt-5 [&_h2]:mb-2",
          "[&_h2]:text-2xl [&_h2]:font-bold",
          "[&_h3]:mt-4 [&_h3]:mb-2",
          "[&_h3]:text-xl [&_h3]:font-semibold",
          "[&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:list-decimal [&_ol]:pl-6",
          "[&_blockquote]:border-l-4",
          "[&_blockquote]:border-blue-300",
          "[&_blockquote]:pl-4 [&_blockquote]:text-gray-600",
          "[&_pre]:rounded-lg [&_pre]:bg-gray-100",
          "[&_pre]:p-4 [&_pre]:overflow-x-auto",
          "[&_code]:font-mono [&_code]:text-sm",
          "[&_a]:text-blue-700 [&_a]:underline",
          "[&_hr]:my-4",
        ].join(" "),
      },
    },

    onUpdate({ editor: updatedEditor }) {
      // Keep the database content in the existing Markdown format.
      // An empty editor returns an empty string for form validation.
      onChange(
        updatedEditor.isEmpty ? "" : updatedEditor.getMarkdown(),
      );
    },
  });

  // The editor is unavailable until client initialization finishes.
  if (!editor) {
    return (
      <div
        role="status"
        className="rounded-xl border border-gray-300 p-4 text-gray-500"
      >
        Loading editor…
      </div>
    );
  }

  // Each toolbar item defines its action and selected state.
  const formattingButtons = [
    {
      label: "Bold",
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Heading 2",
      active: editor.isActive("heading", { level: 2 }),
      run: () =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Heading 3",
      active: editor.isActive("heading", { level: 3 }),
      run: () =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bullet list",
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      active: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      active: editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Code block",
      active: editor.isActive("codeBlock"),
      run: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  const buttonClass =
    "rounded-md border px-3 py-1.5 text-sm font-medium " +
    "focus-visible:outline focus-visible:outline-2 " +
    "focus-visible:outline-blue-600";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-blue-500">
      {/* Formatting controls remain separate from the editable text. */}
      <div
        role="group"
        aria-label="Text formatting"
        className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3"
      >
        {formattingButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            aria-pressed={button.active}
            onClick={button.run}
            className={`${buttonClass} ${
              button.active
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {button.label}
          </button>
        ))}

        {/* Undo and redo are disabled when no history is available. */}
        <button
          type="button"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          className={`${buttonClass} border-gray-200 bg-white text-gray-700 disabled:opacity-40`}
        >
          Undo
        </button>

        <button
          type="button"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          className={`${buttonClass} border-gray-200 bg-white text-gray-700 disabled:opacity-40`}
        >
          Redo
        </button>
      </div>

      <EditorContent editor={editor} />

      <p className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
        Select text to format it. Use Ctrl+B for bold or Ctrl+I for italic.
      </p>
    </div>
  );
}