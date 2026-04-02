# Hygaar — Project Context

## What is Hygaar

Hygaar is an AI-powered ecommerce content generation platform. It uses agent-based workflows to produce large-scale image and video content for ecommerce brands. The core value proposition is automating high-volume visual content production that would otherwise require large creative teams.

## Current status

**P2 — Agent Workflow Design**

Active workstreams:
- UX flows in Figma (file: Hygaar-UX-2026)
- React + Vite prototype (this repo)
- Brand & style system definition
- Agent workflow design

## Stack

- **Build tool:** Vite
- **Framework:** React with TypeScript (loose — not strict)
- **Styling:** Tailwind CSS v4 (layout and structure) + CSS custom properties from design tokens (all colour, spacing, typography, radius)
- **Language:** TypeScript — loose config, no strict mode
- **Routing:** None yet — add React Router when needed
- **Backend:** None yet — stub all data with mock files in `src/data/`

## Design system

- **Library:** Hygaar UI-Kit — customised variation of Untitled UI
- **Display / heading font:** Onest (Semibold, Medium)
- **Body font:** Inter (Regular)
- **Style direction:** Style B — Friendly & Approachable
- **Design file:** Hygaar-UX-2026 — https://www.figma.com/design/nGtRTNLCg65g8CO0vFFpWP/Hygaar-UX-2026?node-id=252-1504&t=4Nvgvkcax2FbbA3D-1
  Use this for implementing screens and flows
- **Design system:** Hygaar UI-Kit — https://www.figma.com/design/TghDlRFDyXhziDatah5kVI/%E2%9D%96-Hygaar-UI%E2%80%93Kit?node-id=16-399&t=gGmO9C6cCLb2ihqT-1
  Use this for component structure, token values, and variants — check here before creating any new component
- **Token file:** `src/styles/tokens.css` — imported globally, generated from Figma via Style Dictionary
- **Token source:** `src/tokens/tokens.json`

### Token naming structure

Tokens follow a 3-tier system:

- **Primitive** — raw values, never used directly in components
  `--color-blue-500`, `--spacing-4`
- **Semantic** — intent-based aliases, always prefer these in components
  `--color-text-primary`, `--color-surface-raised`, `--spacing-component-gap`
- **Component** — scoped overrides for specific components
  `--button-padding-x`, `--card-border-radius`

### Token reference (from design system)

Naming convention: `--colors/background/bg-primary`, `--colors/text/text-primary-(900)`, `--spacing-4xl`, `--radius-3xl`, `--font-family/font-family-display`

- Two font-family roles: `font-family-display` (Onest) and `font-family-body` (Inter)
- Spacing scale: xxs=2px, xs=4px, lg=12px, xl=16px, 2xl=20px, 4xl=32px, 6xl=48px, 7xl=64px, 10xl=128px
- Font size scale: `--text-sm`, `--text-md`, `--text-lg` (18px), `--text-xl` (20px), `--display-xl` (60px)
- Line height scale: text-lg=28px, text-xl=30px, display-xl=72px
- Border radius: `--radius-3xl` = 20px
- Color structure: Untitled UI base palette + semantic aliases (background, text, border tiers with 25-950 shade steps)

## Project structure

```
src/
  components/     # Reusable UI components — names must match Figma exactly
  pages/          # Page-level components
  data/           # Mock data files — no backend calls
  styles/
    tokens.css    # Compiled design tokens — do not edit manually
  tokens/
    tokens.json   # Token source — generated from Figma via Style Dictionary
```

## Figma to code component mapping

| Figma component | Code component | File |
|---|---|---|
| Button/Primary | `<Button variant="primary">` | `src/components/Button.tsx` |
| Card/Default | `<Card>` | `src/components/Card.tsx` |
| Input/Text | `<TextInput>` | `src/components/TextInput.tsx` |

When implementing a Figma design, match the component name first.
If no direct mapping exists, ask before creating a new component.

## Figma MCP workflow

Figma MCP is connected. When implementing a design:
1. Use `get_design_context` to fetch the exact node before writing any code
2. Map every fill, stroke, spacing, and radius value to its token equivalent
3. If a value in Figma has no matching token, comment it `/* TODO: missing token */` and use the closest semantic token as a placeholder
4. Always pass node-level URLs with `?node-id=xxx` — not the full file URL
5. After building: push back with Code to Canvas for design review

## Agent workflow architecture

- Platform uses multi-agent workflows for content generation
- Agents handle: brief intake -> asset generation -> QA -> export
- The UI must reflect async, multi-step processes clearly — every agent state needs a UI state

## UX principles for Hygaar

- Clarity on process status — users need to know where their content is in the pipeline
- Reduce cognitive load — abstract the complexity of agent workflows from the end user
- Progressive disclosure — show detail only when needed
- Scalable UI patterns — designed for large catalogues (100s of SKUs)
- Always account for async states: loading, error, empty, partial

## Hard rules

- Never hardcode colour, spacing, typography, or radius values
- Always use CSS custom properties: `var(--color-text-primary)` not `#1a1a1a`
- Never use Tailwind utility classes for colour, spacing, or typography if a token exists
- Never create a new token — if a value is missing, flag it as a design gap
- Never approximate a Figma value (e.g. padding looks like ~12px) — ask for the exact token
- Use semantic tokens over primitives in all component code
- Component names must match Figma component names exactly

## Typography

Use type scale tokens, never raw font sizes:
`--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`, `--display-xl`

Line height and letter spacing are bundled in the token — do not override unless explicitly specified in the Figma design.

## What I need Claude to do

- Implement Figma designs as React + TypeScript components using design tokens
- Help design and critique UX flows — especially agent workflow states
- Think through async UX patterns (loading, error, empty, progress)
- Challenge assumptions — if something does not scale to 100s of SKUs, say so
- Reference Figma MCP context when implementing designs
- Write mock data in `src/data/` to make flows feel real without a backend

## What to avoid

- Don't suggest overly complex solutions — this is a prototype, not production
- Don't lose sight of the agent workflow architecture when designing UI
- Don't propose UI patterns that don't account for async states
- Don't create components that don't exist in the Figma library without asking first

## AI tool setup

- **Claude Code:** primary agent for Figma to code implementation and multi-file tasks
  - Default model: `claude-sonnet-4-6` — switch to Opus only for hard architectural problems
  - Run `/compact` before switching to a new feature or file group
  - Run `/clear` between unrelated tasks
- **Cursor:** daily IDE — use chat (Edit + Agent mode) for inline edits and iteration
  - Auto mode for routine edits (unlimited, free)
  - Composer 2 for complex multi-file Cursor sessions
- **Codex:** async background tasks via ChatGPT Pro — mock data generation, boilerplate, routing scaffolding
- **Vercel:** deployment — every push auto-deploys to a shareable URL

## Budget guardrails

- Stay under 200K input tokens per Claude Code session — use `/compact` to manage
- Prefer Sonnet over Opus for all routine work
- Use Cursor Auto mode for daily edits — does not touch Claude Code token budget
- Use Codex (free via ChatGPT Pro) for fire-and-forget tasks that don't need real-time guidance
