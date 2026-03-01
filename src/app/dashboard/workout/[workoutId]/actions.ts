"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().max(100).optional(),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(
  input: z.infer<typeof updateWorkoutSchema>
) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = updateWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await updateWorkout(
    userId,
    parsed.data.workoutId,
    parsed.data.name,
    parsed.data.startedAt
  );
}
