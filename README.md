# Super Ctrl+K 🚀

A premium, dark-themed command palette for managing tasks with your AI intern. Built with Next.js, TypeScript, and Framer Motion.

## ✨ Features

- **Command Palette Interface**: Keyboard-first navigation with ⌘K (Mac) / Ctrl+K (Windows)
- **Task Management**: Create, search, view, update, and delete tasks
- **Fuzzy Search**: Intelligent search powered by Fuse.js
- **Multi-step Flows**: Guided task creation with title and description
- **Dark Theme**: Premium blacks with gradient borders
- **Smooth Animations**: Powered by Framer Motion
- **Local Storage**: Persistent task storage
- **Status Tracking**: Not Started, In Progress, Completed

## 🛠️ Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **cmdk** - Command palette component
- **Framer Motion** - Animations
- **Fuse.js** - Fuzzy search
- **React Context** - State management
- **Geist Font** - Typography

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⌨️ Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Open/close command palette
- `↑` `↓` - Navigate options
- `Enter` - Select option
- `Escape` - Go back or close

## 📦 Commands

### Task Management

- **Create Task** - Add a new task with title and description
- **Search Tasks** - Find tasks using fuzzy search
- **View All Tasks** - See all tasks and their status
- **Task Actions** - Update status, mark complete, or delete

### Task Status

- 🔵 **Not Started** - Task created but not begun
- 🟢 **In Progress** - Currently working on task
- ✅ **Completed** - Task finished

## 🎨 Design System

### Colors

- Background: Pure black (`#000000`)
- Surface: Near black (`#0a0a0a`)
- Borders: Gradient (Purple/Blue)
- Text: Zinc scale

### Typography

- Primary: Geist Sans
- Monospace: Geist Mono

### Components

- Gradient borders on command palette
- Keyboard key styling
- Subtle background animations
- Smooth spring animations

## 🏗️ Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BackgroundAnimation.tsx
│   ├── CommandPalette/
│   │   ├── CommandPalette.css
│   │   ├── CommandPalette.tsx
│   │   └── index.ts
│   ├── KeyboardKey.tsx
│   ├── LoadingSpinner.tsx
│   └── TaskPreview.tsx
├── contexts/
│   └── TaskContext.tsx
└── lib/
    └── types.ts
```

## 🔧 Configuration

Tasks are stored in localStorage with the following keys:

- `super-ctrlk-tasks` - Task data
- `super-ctrlk-recent-commands` - Recent command history

## 📝 License

MIT

## 🙏 Acknowledgments

Built with attention to detail, focusing on premium UX and smooth interactions.
