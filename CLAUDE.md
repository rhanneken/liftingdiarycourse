# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 application (App Router) built with TypeScript and Tailwind CSS 4. Currently a fresh scaffold with no application logic yet — intended to become a lifting diary app.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint (flat config with Next.js Core Web Vitals + TypeScript rules)

No test framework is configured yet.

## Docs-First Rule

**IMPORTANT**: Before generating any code, always read the relevant file(s) in the `/docs` directory first. These files define the conventions, patterns, and decisions for this project. Code must conform to what is documented there.

- /docs/ui.md

## Architecture

- **App Router**: All routes live under `src/app/` using Next.js App Router conventions
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS via `@tailwindcss/postcss`; global CSS variables for theming in `src/app/globals.css` with dark mode via `prefers-color-scheme`
- **TypeScript**: Strict mode enabled
- **Authentication**: Clerk (`@clerk/nextjs`) — `<ClerkProvider>` wraps the app in `src/app/layout.tsx`; middleware in `src/proxy.ts` uses `clerkMiddleware()` from `@clerk/nextjs/server`; env vars (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) go in `.env.local`
