import React, { useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MarkdownEditor.css';

const MarkdownEditor = ({ initialValue = '', onChange }) => {
  const [content, setContent] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const insertTextAtCursor = (text) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + text + after;

    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const wrapSelectedText = (before, after = before) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    if (selectedText) {
      const beforeText = content.substring(0, start);
      const afterText = content.substring(end);
      const newContent = beforeText + before + selectedText + after + afterText;

      setContent(newContent);
      if (onChange) {
        onChange(newContent);
      }

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    }
  };

  const handleBold = () => wrapSelectedText('**');
  const handleItalic = () => wrapSelectedText('*');
  const handleStrikethrough = () => wrapSelectedText('~~');
  const handleCode = () => wrapSelectedText('`');

  const handleHeading = (level) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = content.indexOf('\n', start);
    const line = content.substring(lineStart, lineEnd === -1 ? content.length : lineEnd);

    const headingPrefix = '#'.repeat(level) + ' ';
    const newLine = line.replace(/^#{1,6}\s/, '') || 'Heading';
    const newContent =
      content.substring(0, lineStart) +
      headingPrefix + newLine +
      content.substring(lineEnd === -1 ? content.length : lineEnd);

    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleInsertTable = () => {
    const table = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n\n';
    insertTextAtCursor(table);
  };

  const handleInsertLink = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const linkText = selectedText || 'link text';
    const linkMarkdown = `[${linkText}](url)`;

    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + linkMarkdown + after;

    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const handleBulletList = () => {
    insertTextAtCursor('\n- List item 1\n- List item 2\n- List item 3\n');
  };

  const handleNumberedList = () => {
    insertTextAtCursor('\n1. First item\n2. Second item\n3. Third item\n');
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFile = async (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageMarkdown = `\n![${file.name}](${e.target.result})\n`;
        insertTextAtCursor(imageMarkdown);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileLink = `\n[📎 ${file.name}](${e.target.result})\n`;
        insertTextAtCursor(fileLink);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
      for (const file of files) {
        await processFile(file);
      }
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      await processFile(file);
    }
    e.target.value = '';
  };

  const parseExcelData = (text) => {
    const rows = text.split('\n').filter(row => row.trim());
    if (rows.length === 0) return null;

    const cells = rows.map(row =>
      row.split('\t').map(cell => cell.trim())
    );

    const maxCols = Math.max(...cells.map(row => row.length));

    let markdown = '\n';
    cells.forEach((row, index) => {
      const paddedRow = [...row];
      while (paddedRow.length < maxCols) {
        paddedRow.push('');
      }
      markdown += '| ' + paddedRow.join(' | ') + ' |\n';

      if (index === 0) {
        markdown += '| ' + Array(maxCols).fill('---').join(' | ') + ' |\n';
      }
    });
    markdown += '\n';

    return markdown;
  };

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text');

    if (pastedText.includes('\t') || pastedText.split('\n').some(line => line.includes('\t'))) {
      e.preventDefault();
      const tableMarkdown = parseExcelData(pastedText);
      if (tableMarkdown) {
        insertTextAtCursor(tableMarkdown);
      }
    }
  };

  return (
    <div className="markdown-editor-container">
      <div className="toolbar">
        <div className="toolbar-group">
          <button onClick={handleBold} title="Bold (Ctrl+B)" className="toolbar-btn">
            <strong>B</strong>
          </button>
          <button onClick={handleItalic} title="Italic (Ctrl+I)" className="toolbar-btn">
            <em>I</em>
          </button>
          <button onClick={handleStrikethrough} title="Strikethrough" className="toolbar-btn">
            <s>S</s>
          </button>
          <button onClick={handleCode} title="Code" className="toolbar-btn">
            {'<>'}
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button onClick={() => handleHeading(1)} title="Heading 1" className="toolbar-btn">
            H1
          </button>
          <button onClick={() => handleHeading(2)} title="Heading 2" className="toolbar-btn">
            H2
          </button>
          <button onClick={() => handleHeading(3)} title="Heading 3" className="toolbar-btn">
            H3
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button onClick={handleInsertLink} title="Insert Link" className="toolbar-btn">
            🔗
          </button>
          <button onClick={handleInsertTable} title="Insert Table" className="toolbar-btn">
            ⊞
          </button>
          <button onClick={handleBulletList} title="Bullet List" className="toolbar-btn">
            ≡
          </button>
          <button onClick={handleNumberedList} title="Numbered List" className="toolbar-btn">
            1.
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            onClick={() => fileInputRef.current.click()}
            title="Upload File/Image"
            className="toolbar-btn"
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            multiple
            accept="*/*"
          />
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            onClick={() => setShowPreview(!showPreview)}
            title="Toggle Preview"
            className={`toolbar-btn ${showPreview ? 'active' : ''}`}
          >
            👁
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div
          className={`editor-pane ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onPaste={handlePaste}
            placeholder="Start typing your markdown here...

You can:
• Type markdown directly
• Use the toolbar for formatting
• Drag & drop images to insert them
• Drag & drop files (PDFs, etc.) to create links
• Copy cells from Excel and paste to create tables"
            className="editor-textarea"
          />
          {isDragging && (
            <div className="drop-overlay">
              <div className="drop-message">Drop files here</div>
            </div>
          )}
        </div>

        {showPreview && (
          <div className="preview-pane">
            <div className="preview-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Preview will appear here...*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
