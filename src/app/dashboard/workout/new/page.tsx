import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NewWorkoutForm } from "./new-workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">New Workout</h1>
      <NewWorkoutForm initialDateStr={dateParam} />
    </main>
  );
}
