# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Agent Builder with Live Chat** — A production-ready React SPA where users compose AI agent configurations (profile + skills + layers) and engage in real-time streaming chat with multiple LLM providers. Started as a Vivasoft Nepal hiring challenge; now includes real AI streaming, dark glassmorphism UI, Google Drive integration, and performance optimizations.

## Current Implementation Status

✅ **Complete** (all 9 phases shipped):
- Agent builder UI with drag-and-drop support
- Real streaming chat with 6+ LLM providers (OpenRouter free, OpenAI, Anthropic, Google, DeepSeek, Kimi)
- Dark glassmorphism redesign (100% dark mode, layered transparency effects)
- Google OAuth + Google Drive sync (save/load agents to Drive)
- OpenRouter free tier (10-message limit, upgrade modal)
- Modular skill/layer system (.md prompt fragments)
- Performance optimizations (5 critical fixes)
- localStorage persistence for agent configurations

Build status: ✅ **Passing** (`bun run build` — 0 errors)

## Commands

```bash
bun install          # Install dependencies (uses bun.lock)
bun run dev          # Start Vite dev server with HMR
bun run build        # TypeScript check + Vite production build (passes)
bun run lint         # ESLint (flat config, TS + React Hooks)
bun run preview      # Serve production build locally
```

No test framework is configured.

## Tech Stack

- **React 19** with React Compiler (babel-plugin-react-compiler)
- **TypeScript 5.9** — strict mode, noUnusedLocals, noUnusedParameters
- **Vite 8** — build tooling with `@vitejs/plugin-react` + `@rolldown/plugin-babel`
- **ESLint 9** — flat config with react-hooks and react-refresh plugins
- **@dnd-kit** — drag-and-drop for skills/layers
- **Google OAuth 2.0** — GIS SDK for Google Drive integration
- **Tailwind CSS** (via CDN)
- No routing library, no state management library, **no backend** (browser-direct AI calls)

## Architecture

**Component Structure:**
- `src/App.tsx` — root composition, provider routing, chat mode switching
- `src/components/builder/` — AgentBuilderTab, profile/skill/layer selection
- `src/components/chat/` — ChatInput, ChatBubble, LiveChatPlayground, ApiKeyModal, PaymentModal
- `src/components/saved/` — SavedAgentCard, SavedAgentsTab (with Drive sync)
- `src/hooks/` — useAgentBuilder, useLiveChat, useSavedAgents, useMessageLimit, useChatPlayground

**Data flow:**
1. User selects profile → skills (with drag-drop UI) → layers → provider
2. Click "Open Chat" → route to LiveChatPlayground (if free tier) or ApiKeyModal (if paid)
3. useLiveChat hook handles streaming SSE from provider client
4. System prompt = profile description + fetched skill .md files + layer .md files (cached)
5. Saved agents → localStorage (+ optional Google Drive sync)

**Type definitions** in `src/types/index.ts`: Provider, SavedAgent, ChatMessage, AgentProfile, Skill, Layer, etc.

## Data Model

**Agent configurations:**
- `/public/data.json` — 10 profiles, 12 skills, 12 layers (static mock)
- `/public/skills/*.md` — 12 skill prompt fragments (sk_search.md, sk_code.md, etc.)
- `/public/layers/*.md` — 12 layer behavioral instructions (ly_cot.md, ly_pirate.md, etc.)

**Chat system:**
- Real-time SSE streaming from multiple LLM providers
- Message history stored in component state during session
- System prompt dynamically assembled from profile + selected skills + selected layers

## Performance Optimizations (Implemented)

1. **useLiveChat.ts** — Critical streaming fix: `sendMessage` callback now uses refs for mutable state (`messagesRef`, `activeAgentRef`, `isStreamingRef`) with empty dependencies → prevents recreating function on every streaming chunk
2. **SkillPool + LayerPool** — O(1) filter: replaced `Array.includes()` with `Set` for selection lookup
3. **useAgentBuilder.ts** — Analytics interval: now uses ref-based dependency (not state) so interval fires correctly even while user types
4. **SavedAgentCard + ChatBubble** — Module-scope formatters: moved `formatDate` and time formatting out of component body to prevent function recreation
5. **vite.config.ts** — Chunk splitting: vendor chunks (react, @dnd-kit) separated for better cache performance

## Provider Integration

**Free tier (no key required):**
- OpenRouter (Free) — uses `nvidia/nemotron-3-super-120b-a12b:free` model
- 10-message limit per session → PaymentModal (mockup)

**Paid providers (API key modal):**
- OpenAI (ChatGPT models)
- Anthropic (Claude 3.x)
- Google (Gemini)
- DeepSeek
- Kimi

**Provider routing in App.tsx:**
```
OpenRouter (Free) → direct to LiveChatPlayground
Other provider → ApiKeyModal first → LiveChatPlayground
No provider → ChatPlayground (simulated fallback)
```

## Google Integration

- **OAuth via GIS SDK** — user signs in to enable Drive sync
- **appDataFolder REST API** — save/load agent configs to Google Drive (not visible in user's file browser)
- **Auto-sync button** on SavedAgentsTab — "Sync to Drive" / "Load from Drive"

## UI/UX Features

- **Dark glassmorphism** — layered transparency, backdrop blur, dark grays
- **Drag-and-drop** — reorder skills/layers with visual feedback
- **Streaming indicator** — bouncing thinking dots while AI responds
- **Message counter** — "X/10 free messages used" on free tier
- **Payment/upgrade modals** — encourage paid tier after limit exceeded
- **Responsive layout** — two-tab UI (Builder + Saved Agents/Chat)
