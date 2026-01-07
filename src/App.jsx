import React, { useState } from 'react';
import MarkdownEditor from './components/MarkdownEditor';
import './App.css';

function App() {
  const [content, setContent] = useState('');

  const handleContentChange = (newContent) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rich Markdown Editor</h1>
        <p>A Jira-like markdown editor with drag & drop support</p>
      </header>

      <main className="App-main">
        <MarkdownEditor
          initialValue={content}
          onChange={handleContentChange}
        />
      </main>

      <footer className="App-footer">
        <div className="instructions">
          <h3>Features:</h3>
          <ul>
            <li><strong>Text Formatting:</strong> Use toolbar buttons for bold, italic, strikethrough, and code</li>
            <li><strong>Headings:</strong> Click H1, H2, or H3 buttons to create headlines</li>
            <li><strong>Tables:</strong> Insert tables with the table button or paste from Excel</li>
            <li><strong>Lists:</strong> Create bullet or numbered lists</li>
            <li><strong>Images:</strong> Drag & drop images directly into the editor</li>
            <li><strong>Files:</strong> Drag & drop PDFs or other files to create download links</li>
            <li><strong>Excel Paste:</strong> Copy cells from Excel and paste to auto-generate tables</li>
            <li><strong>Links:</strong> Use the link button to insert hyperlinks</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
