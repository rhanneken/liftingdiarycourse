import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { DatePicker } from "@/components/date-picker";
import { getWorkoutsForDate } from "@/data/workouts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const dateStr = dateParam ?? today;
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // local midnight — for display only

  const workouts = await getWorkoutsForDate(userId, dateStr);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8">
        <DatePicker date={date} />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workouts.map((workout) =>
              workout.workoutExercises.map((we) => (
                <Card key={we.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{we.exercise.name}</CardTitle>
                    <CardDescription>
                      {we.sets.length} set{we.sets.length !== 1 ? "s" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {we.sets.map((set) => (
                        <span
                          key={set.id}
                          className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground"
                        >
                          {set.weight}kg × {set.reps}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
}
