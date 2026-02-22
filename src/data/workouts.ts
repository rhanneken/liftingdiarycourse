import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
export async function getWorkoutsForDate(userId: string, dateStr: string) {
  const start = new Date(dateStr + "T00:00:00.000Z");
  const end = new Date(dateStr + "T23:59:59.999Z");
  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, start),
      lte(workouts.startedAt, end)
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  });
}
