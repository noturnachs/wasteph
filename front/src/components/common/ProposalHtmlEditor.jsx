import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, AlertCircle } from "lucide-react";

/**
 * ProposalHtmlEditor - Simple HTML editor that preserves all template styles
 * @param {string} content - Initial HTML content
 * @param {string} templateStyles - CSS styles from template
 * @param {function} onChange - Callback when content is saved, receives { html }
 * @param {function} onUnsavedChange - Callback when unsaved status changes
 * @param {string} className - Additional CSS classes
 */
const ProposalHtmlEditor = ({ content, templateStyles, onChange, onUnsavedChange, className = "" }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef(null);
  const originalContentRef = useRef(content || "");
  const savedContentRef = useRef(content || "");

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && content !== undefined) {
      editorRef.current.innerHTML = content || "";
      originalContentRef.current = content || "";
      savedContentRef.current = content || "";
      setHasUnsavedChanges(false);
    }
  }, [content]);

  // Track changes
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;

    const currentHtml = editorRef.current.innerHTML;
    const hasChanges = currentHtml !== savedContentRef.current;
    setHasUnsavedChanges(hasChanges);

    if (onUnsavedChange) {
      onUnsavedChange(hasChanges);
    }
  }, [onUnsavedChange]);

  // Save changes
  const handleSave = useCallback(() => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;
    savedContentRef.current = html;
    setHasUnsavedChanges(false);

    if (onUnsavedChange) {
      onUnsavedChange(false);
    }

    if (onChange) {
      onChange({ html, json: null });
    }
  }, [onChange, onUnsavedChange]);

  // Reset to original
  const handleReset = useCallback(() => {
    if (!editorRef.current) return;

    const originalContent = originalContentRef.current;
    editorRef.current.innerHTML = originalContent;
    savedContentRef.current = originalContent;
    setHasUnsavedChanges(false);

    if (onUnsavedChange) {
      onUnsavedChange(false);
    }

    if (onChange) {
      onChange({ html: originalContent, json: null });
    }
  }, [onChange, onUnsavedChange]);

  const canReset = editorRef.current?.innerHTML !== originalContentRef.current;

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden flex flex-col ${className}`}>
      {/* Inject template styles */}
      {templateStyles && <style>{templateStyles}</style>}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600">
            Edit the content below directly. Click "Save Changes" when done.
          </span>
        </div>

        <div className="flex gap-2">
          {/* Reset Button */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleReset}
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
            onClick={handleSave}
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

      {/* Editor */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-4 focus:outline-none min-h-[300px] bg-white"
          style={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
};

export default ProposalHtmlEditor;
