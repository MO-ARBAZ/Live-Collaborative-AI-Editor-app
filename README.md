# AI Collaborative Editor

A live collaborative editor with AI-powered text editing and chat capabilities.

## Features

✅ **Rich Text Editor** - Built with TipTap
✅ **AI Chat Sidebar** - Interactive AI assistant
✅ **Floating Toolbar** - Text selection with AI editing options
✅ **Preview Modal** - See changes before applying
✅ **Real-time Editing** - Shorten, lengthen, fix grammar, convert to table

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Text Editing**: Select any text in the editor to see the floating toolbar
2. **AI Chat**: Use the sidebar to chat with the AI assistant
3. **Insert from Chat**: Click "Insert to Editor" on AI responses

## Deployment

Deploy to Vercel:
```bash
npm run build
```

## Tech Stack

- Next.js 14 + TypeScript
- TipTap Editor
- Tailwind CSS
- Mock AI (replace with OpenAI/Claude)

## Demo Features

Currently uses mock AI responses. To enable real AI:
1. Add your API key to `.env.local`
2. Update `/app/api/chat/route.ts` with actual AI integration