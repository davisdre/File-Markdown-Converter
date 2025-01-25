
# Office to Markdown Converter

A web application that converts Office documents to clean Markdown format. Built with React, Express, and Python.

## Features

- Drag and drop file upload
- Multiple file conversion support
- Real-time Markdown preview
- Download individual Markdown files
- Download all Markdown files as ZIP
- Copy Markdown to clipboard
- Beautiful UI with responsive design

## Tech Stack

- **Frontend**: React with TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Express.js (Node.js) with TypeScript
- **Conversion**: Python with MarkItDown library
- **Build Tool**: Vite

## Architecture

1. **Client (`/client`)**: React application handling file uploads and displaying conversions
   - Uses React Query for API calls
   - Implements drag-and-drop functionality
   - Provides real-time Markdown preview

2. **Server (`/server`)**: Express.js server handling file conversion
   - Manages file uploads with Multer
   - Interfaces with Python script for conversion
   - Serves both API and static files

3. **Conversion (`/server/convert.py`)**: Python script using MarkItDown
   - Converts Office documents to Markdown
   - Returns JSON with converted content

## API Endpoints

- `POST /api/convert`: Converts uploaded file to Markdown
  - Accepts: multipart/form-data with file
  - Returns: JSON with markdown content

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://0.0.0.0:5000`.

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Page components
├── server/             # Backend Express application
│   ├── convert.py     # Python conversion script
│   ├── routes.ts      # API routes
│   └── index.ts       # Server entry point
```

## Credits

Made by [Drew](https://x.com/davisdredotcom) with ❤️ | Powered by [Replit](https://replit.com)
