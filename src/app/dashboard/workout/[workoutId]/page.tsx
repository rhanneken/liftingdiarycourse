import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkout } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workoutId: workoutIdParam } = await params;
  const workoutId = parseInt(workoutIdParam, 10);
  if (isNaN(workoutId)) notFound();

  const workout = await getWorkout(userId, workoutId);
  if (!workout) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Edit Workout</h1>
      <EditWorkoutForm
        workoutId={workout.id}
        initialName={workout.name ?? null}
        initialStartedAt={workout.startedAt}
        initialDateStr={workout.startedAt.toISOString().slice(0, 10)}
      />
    </main>
  );
}
