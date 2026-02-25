# Authentication

## Provider

This app uses **Clerk** for all authentication. Do not implement custom auth, sessions, JWTs, or any other authentication mechanism. Everything auth-related goes through Clerk.

## Setup

`<ClerkProvider>` wraps the entire app in `src/app/layout.tsx`. All Clerk components and server helpers are available anywhere within that tree.

Clerk credentials are stored in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Middleware

The Clerk middleware lives in `src/proxy.ts` (not `src/middleware.ts`) and uses `clerkMiddleware()` from `@clerk/nextjs/server`. Do not move or rename this file — Next.js picks it up via the `proxy.ts` convention configured in this project.

```ts
// src/proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

By default `clerkMiddleware()` makes all routes public. To protect a route, use `createRouteMatcher` inside the middleware to explicitly require authentication.

## Getting the Current User (Server Components)

Use `auth()` from `@clerk/nextjs/server` in server components to get the current user's ID:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // userId is safe to use here
}
```

- Always `await auth()` — it returns a promise in App Router.
- Always redirect to `/sign-in` when `userId` is `null`. Do not render protected content for unauthenticated users.
- Never trust a `userId` from URL params, query strings, or request bodies. Always source it from `auth()`.

## UI Components

Use Clerk's pre-built React components for sign-in/sign-up UI. Do not build custom auth forms.

| Component | Import | Purpose |
|---|---|---|
| `<SignInButton>` | `@clerk/nextjs` | Triggers sign-in (use `mode="modal"`) |
| `<SignUpButton>` | `@clerk/nextjs` | Triggers sign-up (use `mode="modal"`) |
| `<SignedIn>` | `@clerk/nextjs` | Renders children only when authenticated |
| `<SignedOut>` | `@clerk/nextjs` | Renders children only when unauthenticated |
| `<UserButton>` | `@clerk/nextjs` | Avatar/menu for the signed-in user |

```tsx
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

<SignedOut>
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

## Imports at a Glance

| What | Import path |
|---|---|
| `auth()` (server) | `@clerk/nextjs/server` |
| `clerkMiddleware()` | `@clerk/nextjs/server` |
| React components | `@clerk/nextjs` |
