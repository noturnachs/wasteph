import { useState, useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import DOMPurify from "dompurify";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Save,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MenuBar = ({ editor, onSave, onReset, hasUnsavedChanges, canReset }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (isActive) =>
    `p-2 rounded transition-colors ${
      isActive
        ? "bg-[#106934] text-white"
        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
    }`;

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-lg items-center justify-between">
      <div className="flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${buttonClass(false)} disabled:opacity-40 disabled:cursor-not-allowed`}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${buttonClass(false)} disabled:opacity-40 disabled:cursor-not-allowed`}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive("underline"))}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={buttonClass(editor.isActive({ textAlign: "left" }))}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={buttonClass(editor.isActive({ textAlign: "center" }))}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={buttonClass(editor.isActive({ textAlign: "right" }))}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={buttonClass(editor.isActive({ textAlign: "justify" }))}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        {/* Reset Button */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onReset}
          disabled={!canReset}
          className={`${
            canReset
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title="Reset to original template"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>

        {/* Save Button */}
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={!hasUnsavedChanges}
          className={`${
            hasUnsavedChanges
              ? "bg-[#106934] hover:bg-[#0d5129] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Save className="w-4 h-4 mr-1" />
          {hasUnsavedChanges ? "Save Changes" : "Saved"}
        </Button>
      </div>
    </div>
  );
};

/**
 * TiptapEditor - Rich text editor for proposal content
 * @param {string} content - Initial HTML content
 * @param {function} onChange - Callback when content is saved, receives { html, json }
 * @param {function} onUnsavedChange - Callback when unsaved status changes, receives boolean
 * @param {string} className - Additional CSS classes for the container
 */
const TiptapEditor = ({ content, onChange, onUnsavedChange, className = "" }) => {
  const [savedContent, setSavedContent] = useState(content || "");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Store the original content for reset functionality
  const originalContentRef = useRef(content || "");

  // Use ref to track saved content in onUpdate callback without causing re-renders
  const savedContentRef = useRef(content || "");
  const onUnsavedChangeRef = useRef(onUnsavedChange);

  // Keep refs in sync
  useEffect(() => {
    savedContentRef.current = savedContent;
  }, [savedContent]);

  useEffect(() => {
    onUnsavedChangeRef.current = onUnsavedChange;
  }, [onUnsavedChange]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Don't strip out HTML attributes
        paragraph: {
          HTMLAttributes: {
            class: null,
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: 'pricing-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    immediatelyRender: false, // Prevents scroll jump on first render
    parseOptions: {
      preserveWhitespace: 'full',
    },
    onUpdate: ({ editor }) => {
      const currentHtml = editor.getHTML();
      const hasChanges = currentHtml !== savedContentRef.current;
      setHasUnsavedChanges(hasChanges);
      // Notify parent of unsaved changes
      if (onUnsavedChangeRef.current) {
        onUnsavedChangeRef.current(hasChanges);
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none p-4 focus:outline-none min-h-[300px] bg-white",
      },
    },
  });

  const handleSave = useCallback(() => {
    if (!editor) return;

    const html = editor.getHTML();
    const json = editor.getJSON();

    // Sanitize HTML before saving (preserve all formatting and structure)
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "u", "s", "b", "i",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li",
        "blockquote", "pre", "code",
        "table", "thead", "tbody", "tfoot", "tr", "th", "td",
        "a", "span", "div", "section", "article", "header", "footer",
        "img", "hr",
      ],
      ALLOWED_ATTR: ["href", "target", "style", "class", "id", "src", "alt", "title", "width", "height"],
      ALLOW_DATA_ATTR: true,
    });

    savedContentRef.current = sanitizedHtml;
    setSavedContent(sanitizedHtml);
    setHasUnsavedChanges(false);

    // Notify parent of save (resets unsaved state)
    if (onUnsavedChangeRef.current) {
      onUnsavedChangeRef.current(false);
    }

    if (onChange) {
      onChange({ html: sanitizedHtml, json });
    }
  }, [editor, onChange]);

  // Update editor content when initial content prop changes
  useEffect(() => {
    if (editor && content !== undefined && content !== savedContentRef.current) {
      editor.commands.setContent(content || "");
      originalContentRef.current = content || "";
      savedContentRef.current = content || "";
      setSavedContent(content || "");
      setHasUnsavedChanges(false);
    }
  }, [content, editor]);

  // Reset to original template content
  const handleReset = useCallback(() => {
    if (!editor) return;

    const originalContent = originalContentRef.current;
    editor.commands.setContent(originalContent);
    savedContentRef.current = originalContent;
    setSavedContent(originalContent);
    setHasUnsavedChanges(false);

    if (onUnsavedChangeRef.current) {
      onUnsavedChangeRef.current(false);
    }

    if (onChange) {
      onChange({ html: originalContent, json: editor.getJSON() });
    }
  }, [editor, onChange]);

  // Check if content has changed from original (for reset button)
  const canReset = editor ? editor.getHTML() !== originalContentRef.current : false;

  // Expose methods for parent component
  const getContent = useCallback(() => {
    if (!editor) return { html: "", json: null };
    return {
      html: DOMPurify.sanitize(editor.getHTML()),
      json: editor.getJSON(),
    };
  }, [editor]);

  const getSavedContent = useCallback(() => {
    return savedContent;
  }, [savedContent]);

  const hasChanges = useCallback(() => {
    return hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden flex flex-col ${className}`}>
      <style>{`
        /* Preserve table styling from templates */
        .ProseMirror table,
        .ProseMirror .pricing-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 15px 0 !important;
          display: table !important;
        }

        .ProseMirror table thead,
        .ProseMirror .pricing-table thead {
          background-color: #003333 !important;
          color: white !important;
          display: table-header-group !important;
        }

        .ProseMirror table tbody,
        .ProseMirror .pricing-table tbody {
          display: table-row-group !important;
        }

        .ProseMirror table tr,
        .ProseMirror .pricing-table tr {
          display: table-row !important;
        }

        .ProseMirror table th,
        .ProseMirror table td,
        .ProseMirror .pricing-table th,
        .ProseMirror .pricing-table td {
          border: 1px solid #000 !important;
          padding: 10px !important;
          text-align: left !important;
          display: table-cell !important;
        }

        .ProseMirror table th,
        .ProseMirror .pricing-table th {
          font-weight: bold !important;
        }

        /* Override prose styles that might interfere */
        .prose table {
          font-size: 1em;
        }

        .prose thead th {
          padding: 10px;
        }

        .prose tbody td {
          padding: 10px;
        }
      `}</style>
      <MenuBar
        editor={editor}
        onSave={handleSave}
        onReset={handleReset}
        hasUnsavedChanges={hasUnsavedChanges}
        canReset={canReset}
      />
      <div className="flex-1 overflow-y-auto min-h-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
