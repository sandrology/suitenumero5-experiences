
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, ListOrdered, Palette,
  Type
} from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialValue,
  onChange,
  placeholder = 'Enter content here...'
}) => {
  const [value, setValue] = useState(initialValue);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  useEffect(() => {
    // Set data-placeholder using data attribute
    if (editorRef.current) {
      editorRef.current.setAttribute('data-placeholder', placeholder);
    }
  }, [placeholder]);

  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML;
      setValue(newValue);
      onChange(newValue);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
    // Mantieni il focus sull'editor dopo l'esecuzione del comando
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Handle pasted content
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text');
    
    // Insert text at cursor position
    document.execCommand('insertHTML', false, text);
    handleInput();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setSelectedColor(color);
    execCommand('foreColor', color);
  };

  const colorOptions = ["#000000", "#ff0000", "#0000ff", "#008000", "#ffa500", "#800080"];

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1 rounded hover:bg-gray-200"
          title="Bold"
        >
          <Bold className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1 rounded hover:bg-gray-200"
          title="Italic"
        >
          <Italic className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1 rounded hover:bg-gray-200"
          title="Bullet List"
        >
          <List className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-1 rounded hover:bg-gray-200"
          title="Numbered List"
        >
          <ListOrdered className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="p-1 rounded hover:bg-gray-200"
          title="Heading 1"
        >
          <Heading1 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="p-1 rounded hover:bg-gray-200"
          title="Heading 2"
        >
          <Heading2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="p-1 rounded hover:bg-gray-200"
          title="Heading 3"
        >
          <Heading3 className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-1 rounded hover:bg-gray-200"
          title="Align Left"
        >
          <AlignLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-1 rounded hover:bg-gray-200"
          title="Align Center"
        >
          <AlignCenter className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-1 rounded hover:bg-gray-200"
          title="Align Right"
        >
          <AlignRight className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-1 rounded hover:bg-gray-200 flex items-center"
            title="Text Color"
          >
            <Palette className="h-5 w-5" />
            <div className="ml-1 w-3 h-3 rounded-full" style={{ backgroundColor: selectedColor }}></div>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border rounded-md shadow-lg z-10">
              <div className="flex gap-1 mb-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      execCommand('foreColor', color);
                      setSelectedColor(color);
                      setShowColorPicker(false);
                    }}
                  ></button>
                ))}
              </div>
              <input
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
                className="w-full cursor-pointer"
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => execCommand('removeFormat')}
          className="p-1 rounded hover:bg-gray-200 ml-1"
          title="Clear Formatting"
        >
          <Type className="h-5 w-5" />
        </button>
      </div>
      <div
        ref={editorRef}
        className="w-full p-4 min-h-[200px] focus:outline-none focus:ring-1 focus:ring-primary overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: initialValue }}
        style={{ minHeight: '200px' }}
      />
      <div className="p-2 bg-gray-50 border-t text-xs text-gray-500">
        Usa i pulsanti della barra degli strumenti per la formattazione. Puoi anche incollare contenuto con formattazione.
      </div>
    </div>
  );
};

export default RichTextEditor;
