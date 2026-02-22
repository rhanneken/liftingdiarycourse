# Data Fetching

## Server Components Only

**ALL data fetching must be done exclusively via React Server Components.**

Do not fetch data in:
- Route handlers (`src/app/api/`)
- Client components (`"use client"`)
- Server actions
- Any other mechanism

If a client component needs data, fetch it in a parent server component and pass it down as props.

## Database Queries via `/data` Helpers

All database queries must go through helper functions in the `/data` directory. Do not write database queries inline in components.

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
    ...
```

Each helper function must use **Drizzle ORM** to query the database. Raw SQL is strictly forbidden.

```ts
// ✅ Correct — Drizzle ORM via a /data helper
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

// ❌ Wrong — raw SQL
const rows = await db.execute(sql`SELECT * FROM workouts`);

// ❌ Wrong — query written inline in a component
const data = await db.select().from(workouts);
```

## User Data Isolation

**A logged-in user must only ever be able to access their own data.**

Every `/data` helper that queries user-owned data must:

1. Accept `userId` as a parameter
2. Filter all queries by that `userId`

Retrieve the current user's ID from Clerk (`auth()`) in the server component, then pass it to the helper. Never derive or trust a `userId` from URL params, query strings, or request bodies — always source it from the authenticated session.

```ts
// src/app/dashboard/page.tsx (server component)
import { auth } from "@clerk/nextjs/server";
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const workouts = await getWorkouts(userId);

  return <WorkoutList workouts={workouts} />;
}

// src/data/workouts.ts
export async function getWorkouts(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId));
}
```

Never fetch all rows and filter in application code. The `WHERE userId = ?` constraint must be present in the query itself.
