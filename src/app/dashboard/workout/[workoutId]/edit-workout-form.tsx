"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateWorkoutAction } from "./actions";

interface EditWorkoutFormProps {
  workoutId: number;
  initialName: string | null;
  initialStartedAt: Date;
}

export function EditWorkoutForm({
  workoutId,
  initialName,
  initialStartedAt,
}: EditWorkoutFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [date, setDate] = useState<Date>(initialStartedAt);
  const [time, setTime] = useState(() => {
    const h = String(initialStartedAt.getHours()).padStart(2, "0");
    const m = String(initialStartedAt.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  });

  const cancelDateStr = format(initialStartedAt, "yyyy-MM-dd");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const [hours, minutes] = time.split(":").map(Number);
    const startedAt = new Date(date);
    startedAt.setHours(hours, minutes, 0, 0);
    const result = await updateWorkoutAction({
      workoutId,
      name: name || undefined,
      startedAt,
    });
    if (!result?.error) {
      router.push(`/dashboard?date=${format(startedAt, "yyyy-MM-dd")}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Workout Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Push Day"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Start</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-44 justify-start gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "do MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => {
                  if (day) setDate(day);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="w-fit">
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/dashboard?date=${cancelDateStr}`)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
