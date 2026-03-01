# Routing

## Structure

All application routes live under `/dashboard`. The root `/` route is a public landing page only.

```
/                        → public landing page
/dashboard               → main app entry (protected)
/dashboard/workout/new   → create a workout (protected)
/dashboard/workout/[id]  → view/edit a workout (protected)
```

Every route under `/dashboard` is a protected route — only accessible to authenticated users.

## Route Protection

Route protection is handled in the Next.js middleware (`src/proxy.ts`) using Clerk's `createRouteMatcher`. Do not add auth checks in individual page components for the purpose of route protection — the middleware is the single source of truth.

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- Use `createRouteMatcher(["/dashboard(.*)"])` to match all dashboard routes.
- Call `auth.protect()` to redirect unauthenticated users to the Clerk sign-in page automatically.
- Never add new protected route trees outside of `/dashboard` without updating the matcher in `proxy.ts`.

## Adding New Routes

All new pages belong under `src/app/dashboard/`. Do not create top-level routes for app functionality.

- Nested resource routes follow the pattern `/dashboard/[resource]/[id]`
- Action-specific sub-routes use a named segment: `/dashboard/[resource]/new`, `/dashboard/[resource]/[id]/edit`
- Route groups (`(groupName)`) may be used for layout sharing but do not affect the URL path
