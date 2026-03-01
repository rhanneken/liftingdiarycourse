# Server Components

## Async Server Components

All page and layout components in the App Router must be declared `async`. Data fetching, auth checks, and any other async operations must be awaited directly in the component body.

```ts
// ✅ Correct
export default async function WorkoutPage() {
  const { userId } = await auth();
  // ...
}

// ❌ Wrong — not async
export default function WorkoutPage() {
  // ...
}
```

## Params and SearchParams

**`params` and `searchParams` are Promises in Next.js 16 and must be awaited.**

Do not destructure or access properties from `params` or `searchParams` directly — always `await` them first.

```ts
// ✅ Correct
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  // ...
}

// ❌ Wrong — params is a Promise, not a plain object
export default async function WorkoutPage({
  params,
}: {
  params: { workoutId: string };
}) {
  const { workoutId } = params;
  // ...
}
```

The same applies to `searchParams`:

```ts
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const { date } = await searchParams;
  // ...
}
```

## Dynamic Segment Validation

After awaiting `params`, always validate dynamic segments before using them. If a segment is expected to be a number, parse and check it — call `notFound()` if it is invalid or the resource does not exist.

```ts
import { notFound } from "next/navigation";

const { workoutId: workoutIdParam } = await params;
const workoutId = parseInt(workoutIdParam, 10);
if (isNaN(workoutId)) notFound();

const workout = await getWorkout(userId, workoutId);
if (!workout) notFound();
```
