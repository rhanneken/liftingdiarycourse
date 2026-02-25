"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().max(100).optional(),
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(
  input: z.infer<typeof createWorkoutSchema>
) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await createWorkout(userId, parsed.data.name, parsed.data.startedAt);
}
