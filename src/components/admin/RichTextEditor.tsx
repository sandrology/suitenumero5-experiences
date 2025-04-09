
import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const applyFormat = (format: string, value?: string) => {
    execCommand(format, value);
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      // This is a simplified approach - in a real editor you'd need more complex handling
      const tag = format === 'bold' ? 'strong' : 
                  format === 'italic' ? 'em' : 
                  format === 'insertUnorderedList' ? 'ul' : 
                  format === 'heading' ? `h${value}` : 'span';
      
      const formattedText = `<${tag}>${selection.toString()}</${tag}>`;
      const newValue = value.replace(selection.toString(), formattedText);
      setValue(newValue);
      onChange(newValue);
    }
  };

  // This is a simplified rich text editor for the MVP
  // In a real app, you would use a proper rich text editor library like Quill, TinyMCE, etc.
  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Bold className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Italic className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => applyFormat('insertUnorderedList')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <List className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => applyFormat('heading', '1')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Heading1 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('heading', '2')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Heading2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('heading', '3')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <Heading3 className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => applyFormat('justifyLeft')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <AlignLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyCenter')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <AlignCenter className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('justifyRight')}
          className="p-1 rounded hover:bg-gray-200"
        >
          <AlignRight className="h-5 w-5" />
        </button>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-4 min-h-[200px] resize-y focus:outline-none focus:ring-1 focus:ring-primary"
        rows={10}
      />
      <div className="p-2 bg-gray-50 border-t text-xs text-gray-500">
        You can use HTML tags for formatting. For a better experience, use the toolbar buttons.
      </div>
    </div>
  );
};

export default RichTextEditor;
