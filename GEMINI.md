# AI Agent Profile Builder - GEMINI.md

This file provides comprehensive context for the AI Agent Profile Builder project, used for development, architecture mapping, and instructional guidance within the Gemini CLI.

## Project Overview

The **AI Agent Profile Builder** is a modern React 19 Single Page Application (SPA) designed to create, configure, and save customized AI agent profiles. Users can select base personas, drag-and-drop specific skills and personality layers, choose an AI provider, and persist their configurations to local storage.

This project was evolved from a hiring challenge into a modular, performant, and feature-rich application.

## Tech Stack

- **Framework**: React 19 (utilizing React Compiler for optimized rendering).
- **Language**: TypeScript (strict mode enabled).
- **Build Tooling**: Vite 8 with `@vitejs/plugin-react` and `@rolldown/plugin-babel`.
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`) for responsive and performant design.
- **Drag-and-Drop**: `@dnd-kit/core` and `@dnd-kit/sortable` for intuitive configuration building.
- **State Management**: Custom React Hooks for data fetching, builder state, and persistence.
- **Persistence**: `localStorage` for saving and reloading agent configurations.

## Architecture

The project follows a modular, feature-based architecture to ensure maintainability and separation of concerns.

### 1. Root Composition (`src/App.tsx`)
The `App` component serves as the orchestrator, wiring together data hooks (`useAgentData`), builder logic (`useAgentBuilder`), and persistence (`useSavedAgents`). It provides the top-level layout and context wrappers (ErrorBoundary, ToastProvider).

### 2. Custom Hooks (`src/hooks/`)
- `useAgentData`: Handles fetching static configuration data from `/public/data.json`.
- `useAgentBuilder`: Manages the complex state of the current agent being built (profile, skills, layers, name, provider). Uses immutable update patterns.
- `useSavedAgents`: Manages CRUD operations for agents stored in `localStorage`.
- `useLocalStorage`: Low-level primitive for persistent browser state.

### 3. Feature Components (`src/components/`)
- `builder/`: Main preview and saving logic.
- `layers/` & `skills/`: Item pools and draggable cards for personality and capabilities.
- `profile/` & `provider/`: Grid selectors for base personas and AI models.
- `shared/`: Reusable UI elements (DndWrapper, ErrorBoundary, Toast, LoadingSkeleton).
- `layout/`: Global header and structural elements.

### 4. Logic & Types (`src/lib/`, `src/types/`)
- `constants.ts`: Visual configuration (colors, icons, mappings).
- `utils.ts`: Utility functions for Tailwind class merging and standard helpers.
- `index.ts`: Shared TypeScript interfaces (`AgentProfile`, `Skill`, `Layer`, `SavedAgent`).

## Building and Running

Commands are executed using **Bun**.

| Command | Description |
| :--- | :--- |
| `bun install` | Installs project dependencies. |
| `bun run dev` | Starts the Vite development server with HMR. |
| `bun run build` | Performs TypeScript type checking and Vite production build. |
| `bun run lint` | Runs ESLint for code quality and style checks. |
| `bun run preview` | Serves the production build locally. |

## Development Conventions

- **State Immutability**: Always use functional updates for state arrays and objects (e.g., `setItems(prev => [...prev, newItem])`) to prevent direct mutation bugs.
- **Component Extraction**: New features should be placed in the appropriate `src/components/` sub-directory.
- **Type Safety**: All API data and component props must be strictly typed in `src/types/index.ts`.
- **Styling**: Use utility-first Tailwind classes. Avoid complex custom CSS unless necessary (manage via `src/App.css` or `src/index.css`).
- **Accessibility**: Ensure all interactive elements (buttons, inputs, draggable items) remain keyboard-accessible and screen-reader friendly.

## Data Model

The application consumes `public/data.json` containing:
- **Agent Profiles**: Base personas (Customer Support, Developer, etc.).
- **Skills**: Modular capabilities categorized as `information` or `action`.
- **Layers**: Personality and formatting modifiers (`reasoning`, `context`, etc.).
