import React, { useRef, useEffect } from "react";
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Type } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Tulis konten di sini...",
  height = "250px"
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync value from prop to editor (only when innerHTML differs to avoid cursor jump)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val = "") => {
    document.execCommand(command, false, val);
    handleInput();
  };

  return (
    <div className="rich-editor-container">
      <div className="rich-editor-toolbar">
        <button type="button" onClick={() => execCommand("bold")} title="Tebal (Bold)"><Bold size={15} /></button>
        <button type="button" onClick={() => execCommand("italic")} title="Miring (Italic)"><Italic size={15} /></button>
        <button type="button" onClick={() => execCommand("underline")} title="Garis Bawah (Underline)"><Underline size={15} /></button>
        
        <div className="rich-editor-divider"></div>
        
        <button type="button" onClick={() => execCommand("insertUnorderedList")} title="Daftar Bulatan"><List size={15} /></button>
        <button type="button" onClick={() => execCommand("insertOrderedList")} title="Daftar Angka"><ListOrdered size={15} /></button>
        
        <div className="rich-editor-divider"></div>
        
        <button type="button" onClick={() => execCommand("justifyLeft")} title="Rata Kiri"><AlignLeft size={15} /></button>
        <button type="button" onClick={() => execCommand("justifyCenter")} title="Rata Tengah"><AlignCenter size={15} /></button>
        <button type="button" onClick={() => execCommand("justifyRight")} title="Rata Kanan"><AlignRight size={15} /></button>
        
        <div className="rich-editor-divider"></div>
        
        <button type="button" onClick={() => execCommand("removeFormat")} title="Hapus Format"><Type size={15} /></button>
      </div>
      <div
        ref={editorRef}
        className="rich-editor-content"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight: height, maxHeight: "400px", overflowY: "auto" }}
      />
    </div>
  );
};
