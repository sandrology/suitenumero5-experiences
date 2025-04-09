
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight
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

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  useEffect(() => {
    // Imposta l'attributo data-placeholder utilizzando un data attribute invece di placeholder diretto
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
      </div>
      <div
        ref={editorRef}
        className="w-full p-4 min-h-[200px] focus:outline-none focus:ring-1 focus:ring-primary overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: initialValue }}
        style={{ minHeight: '200px' }}
      />
      <div className="p-2 bg-gray-50 border-t text-xs text-gray-500">
        Usa i pulsanti della barra degli strumenti per la formattazione. HTML è supportato.
      </div>
    </div>
  );
};

export default RichTextEditor;
