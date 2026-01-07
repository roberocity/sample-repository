# Rich Markdown Editor

A feature-rich React markdown editor component similar to Jira's description editor. This editor supports real-time preview, drag & drop functionality, and Excel table pasting.

## Features

- **Rich Text Formatting**: Bold, italic, strikethrough, and inline code
- **Headings**: H1, H2, H3 support
- **Tables**: Insert tables via toolbar or paste from Excel
- **Lists**: Bullet and numbered lists
- **Images**: Drag & drop images directly into the editor
- **Files**: Drag & drop PDFs and other files to create download links
- **Excel Integration**: Copy cells from Excel and paste to auto-generate markdown tables
- **Links**: Easy hyperlink insertion
- **Live Preview**: Side-by-side editor and preview panes
- **Markdown Support**: Full GitHub Flavored Markdown (GFM) support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/roberocity/sample-repository.git
cd sample-repository
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Basic Usage

```jsx
import MarkdownEditor from './components/MarkdownEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  const handleChange = (newContent) => {
    setContent(newContent);
    // Do something with the content
  };

  return (
    <MarkdownEditor
      initialValue={content}
      onChange={handleChange}
    />
  );
}
```

### Features Guide

#### Text Formatting
- **Bold**: Select text and click the **B** button or wrap text with `**text**`
- **Italic**: Select text and click the *I* button or wrap text with `*text*`
- **Strikethrough**: Select text and click the <s>S</s> button or wrap text with `~~text~~`
- **Code**: Select text and click the `<>` button or wrap text with `` `code` ``

#### Headings
Click H1, H2, or H3 buttons to create headlines. The current line will be converted to the selected heading level.

#### Tables
- Click the table button to insert a template table
- Or copy cells from Excel and paste directly into the editor

#### Lists
- **Bullet List**: Click the ≡ button to insert a bullet list template
- **Numbered List**: Click the 1. button to insert a numbered list template

#### Images
- Drag and drop image files directly into the editor
- Or click the 📎 button to upload files
- Supported formats: JPG, PNG, GIF, SVG, etc.

#### Files (PDFs, Documents)
- Drag and drop any file type into the editor
- Files will be embedded as base64 data URLs
- A link with a file icon will be created at the drop location

#### Excel to Table
1. Open Excel and select cells
2. Copy the cells (Ctrl+C / Cmd+C)
3. Paste into the editor (Ctrl+V / Cmd+V)
4. The cells will automatically convert to a markdown table

## Component Props

### MarkdownEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | string | `''` | Initial markdown content |
| `onChange` | function | `undefined` | Callback function called when content changes |

## Technology Stack

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **react-markdown**: Markdown rendering
- **remark-gfm**: GitHub Flavored Markdown support

## Project Structure

```
sample-repository/
├── src/
│   ├── components/
│   │   ├── MarkdownEditor.jsx    # Main editor component
│   │   └── MarkdownEditor.css    # Editor styles
│   ├── App.jsx                    # Demo application
│   ├── App.css                    # App styles
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── vite.config.js                 # Vite configuration
└── package.json                   # Dependencies

```

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
