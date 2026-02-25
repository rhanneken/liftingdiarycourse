# Data Mutations

## Database Writes via `/data` Helpers

**ALL database mutations must go through helper functions in the `src/data/` directory.** Do not write Drizzle ORM calls inline in server actions or components.

Each helper must use **Drizzle ORM**. Raw SQL is strictly forbidden.

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
    ...
```

```ts
// ✅ Correct — Drizzle ORM via a /data helper
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

// ❌ Wrong — Drizzle call written inline in a server action
await db.insert(workouts).values({ userId, name, date });

// ❌ Wrong — raw SQL
await db.execute(sql`INSERT INTO workouts ...`);
```

## Server Actions

**ALL mutations must be performed via server actions.** Do not mutate data via route handlers (`src/app/api/`) or anywhere else.

### File Colocation

Server actions must live in a file named `actions.ts` colocated with the route that uses them.

```
src/app/
  dashboard/
    page.tsx
    actions.ts       ← server actions for the dashboard route
  workouts/
    [id]/
      page.tsx
      actions.ts     ← server actions for the workout detail route
```

### Typed Parameters

All server action parameters must be explicitly typed. **`FormData` is forbidden as a parameter type.** Accept plain typed objects or individual typed arguments instead.

```ts
// ✅ Correct — typed parameters
export async function createWorkout(input: CreateWorkoutInput) { ... }

// ❌ Wrong — FormData parameter
export async function createWorkout(formData: FormData) { ... }
```

### Zod Validation

**Every server action must validate its arguments with Zod** before doing anything else. Never trust incoming data, even from your own client components.

Define schemas in the same `actions.ts` file, above the action functions.

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(input: z.infer<typeof createWorkoutSchema>) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await createWorkout(userId, parsed.data.name, parsed.data.date);
}
```

### Redirects

**Never call `redirect()` inside a server action.** Redirects must be handled client-side after the server action resolves.

```ts
// ✅ Correct — redirect done client-side after the action resolves
"use client";

async function handleSubmit() {
  const result = await createWorkoutAction(input);
  if (!result?.error) {
    router.push("/dashboard");
  }
}

// ❌ Wrong — redirect called inside the server action
export async function createWorkoutAction(input: CreateWorkoutInput) {
  // ...
  await createWorkout(userId, input.name, input.date);
  redirect("/dashboard");
}
```

The one exception is redirecting unauthenticated users — `redirect("/sign-in")` when `userId` is null is still required inside server actions, as there is no meaningful result to return to the client in that case.

## User Data Isolation

**A logged-in user must only ever be able to mutate their own data.**

Every `/data` mutation helper that writes user-owned data must:

1. Accept `userId` as a parameter
2. Scope all writes to that `userId` (e.g. insert with `userId`, update/delete with a `WHERE userId = ?` guard)

Always source `userId` from the authenticated Clerk session inside the server action — never accept it as a parameter from the client.

```ts
// ✅ Correct — userId sourced from session, not from client input
export async function deleteWorkoutAction(input: { workoutId: string }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = z.object({ workoutId: z.string().uuid() }).safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await deleteWorkout(userId, parsed.data.workoutId);
}

// src/data/workouts.ts
export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

// ❌ Wrong — userId accepted from the client
export async function deleteWorkoutAction(input: { workoutId: string; userId: string }) { ... }
```
