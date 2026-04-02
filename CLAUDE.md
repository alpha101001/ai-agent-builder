# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Agent Profile Builder — a React SPA where users compose AI agent configurations by selecting a base profile, skills, layers, and an AI provider. This is a **Vivasoft Nepal hiring challenge** repo; the codebase intentionally contains bugs and anti-patterns for candidates to identify and fix.

## Commands

```bash
bun install          # Install dependencies (uses bun.lock)
bun run dev          # Start Vite dev server with HMR
bun run build        # TypeScript check + Vite production build
bun run lint         # ESLint (flat config, TS + React Hooks rules)
bun run preview      # Serve production build locally
```

No test framework is configured.

## Tech Stack

- **React 19** with React Compiler (babel-plugin-react-compiler)
- **TypeScript 5.9** — strict mode, noUnusedLocals, noUnusedParameters
- **Vite 8** — build tooling with `@vitejs/plugin-react` + `@rolldown/plugin-babel`
- **ESLint 9** — flat config with react-hooks and react-refresh plugins
- No routing library, no CSS framework, no state management library, no backend

## Architecture

The entire application lives in a single monolithic component (`src/App.tsx`, ~410 lines). There are no extracted sub-components, custom hooks, or context providers.

**Data flow:**
- `fetchAPI()` loads `/public/data.json` (10 agent profiles, 12 skills, 12 layers) with a simulated 1–3s delay
- User selections are held in `useState` hooks (profile, skills[], layers[], provider)
- Saved agents persist to `localStorage`
- No backend calls — provider selection (Gemini, ChatGPT, Claude, etc.) is UI-only

**Type definitions** are inline at the top of `App.tsx`: `AgentProfile`, `Skill`, `Layer`, `AgentData`, `SavedAgent`.

## Intentional Bugs & Anti-Patterns

These are placed deliberately for the challenge:

1. **Direct state mutation** — `handleLayerSelect` pushes onto the existing array reference instead of spreading
2. **Stale closure** — analytics heartbeat interval captures `agentName` but has an empty dependency array
3. **Redundant API calls** — `fetchAPI()` is called inside `handleSkillSelect`, `handleLayerSelect`, and on every profile dropdown change, re-fetching static data unnecessarily
4. **No component extraction** — everything is in one component with inline styles
5. **No responsive design or accessibility**

## Data Model

Static mock data in `/public/data.json`:
- **Profiles**: base agent personas (Customer Support, Code Assistant, Data Analyst, etc.)
- **Skills**: categorized as `information` or `action`
- **Layers**: categorized as `reasoning`, `personality`, `context`, or `formatting`

## Challenge Goals (from README)

- Fix React anti-patterns and performance issues
- Implement drag-and-drop UI (replacing dropdowns)
- Extract components, add responsive design
- Submit as a PR with explanation of fixes and design decisions
