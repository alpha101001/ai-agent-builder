# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the Vite React application. Feature UI is grouped under `src/components/` (`builder/`, `chat/`, `layers/`, `profile/`, `provider/`, `saved/`, `shared/`, `skills/`), reusable state lives in `src/hooks/`, shared logic and prompt utilities live in `src/lib/`, and shared TypeScript types are in `src/types/`. Static data and deliverables live in `public/`, including `public/data.json`, `public/skills/`, `public/layers/`, and the required CV PDF. `dist/` is generated build output and should not be edited by hand.

## Build, Test, and Development Commands
Use `pnpm`; the repository includes `pnpm-lock.yaml`.

- `pnpm install` installs dependencies.
- `pnpm dev` starts the local Vite development server.
- `pnpm build` runs `tsc -b` and creates the production bundle in `dist/`.
- `pnpm lint` runs ESLint across the TypeScript codebase.
- `pnpm preview` serves the production build locally for final review.

## Coding Style & Naming Conventions
Write TypeScript with functional React components and hooks. Follow the existing style: 2-space indentation, single quotes, and no semicolons. Name components in PascalCase such as `AgentPreview.tsx`, hooks with the `use` prefix such as `useAgentBuilder.ts`, and utility modules in lowercase or kebab-case such as `system-prompt-builder.ts`. Keep business logic in hooks or `src/lib/`, and keep presentational components focused on rendering and interaction.

## Testing Guidelines
No automated test runner is configured yet, so every change should at least pass `pnpm lint` and `pnpm build`. Validate behavior manually in `pnpm dev`, especially drag-and-drop flows, localStorage persistence, saved agents, and provider-specific chat behavior. If you add tests, keep them close to the feature with names like `Component.test.tsx` or `hook.test.ts`.

## Commit & Pull Request Guidelines
The Git history is currently sparse, so there is no stable historical convention to copy. Use clear, imperative commit subjects that explain intent, and include concise rationale when the change is not obvious. For larger changes, include trailers such as `Constraint:`, `Rejected:`, and `Tested:`. Pull requests should summarize bug fixes, performance improvements, and UI decisions, link related issues when available, include screenshots or a short recording for UI changes, mention any AI tools used, and include a public design link if you created one.
