import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { DatePicker } from "@/components/date-picker";
import { getWorkoutsForDate } from "@/data/workouts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>
          <Button asChild>
            <Link href="/dashboard/workout/new">Log Workout</Link>
          </Button>
        </div>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground">No workouts logged for this date.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {workouts.map((workout) => {
              let statusText: string;
              if (workout.completedAt) {
                const totalMinutes = Math.round(
                  (workout.completedAt.getTime() - workout.startedAt.getTime()) / 60000
                );
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                if (hours > 0 && mins > 0) {
                  statusText = `${hours}h ${mins} min`;
                } else if (hours > 0) {
                  statusText = `${hours}h`;
                } else {
                  statusText = `${mins} min`;
                }
              } else {
                statusText = "In Progress";
              }

              return (
                <Link key={workout.id} href={`/dashboard/workout/${workout.id}`}>
                  <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                    <CardHeader>
                      {workout.name && (
                        <CardTitle className="text-base">{workout.name}</CardTitle>
                      )}
                      <CardDescription>{statusText}</CardDescription>
                      <CardAction>
                        <p className="text-xs text-muted-foreground">
                          {format(workout.startedAt, "h:mm a")}
                        </p>
                      </CardAction>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
