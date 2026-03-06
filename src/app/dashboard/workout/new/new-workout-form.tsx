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
import { createWorkoutAction } from "./actions";

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function parseDateStr(dateStr: string | undefined): Date {
  if (dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date();
}

export function NewWorkoutForm({ initialDateStr }: { initialDateStr?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>(() => parseDateStr(initialDateStr));
  const [time, setTime] = useState(getCurrentTime);

  function getDateStr(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const [hours, minutes] = time.split(":").map(Number);
    const startedAt = new Date(date);
    startedAt.setHours(hours, minutes, 0, 0);
    const result = await createWorkoutAction({ name: name || undefined, startedAt });
    if (!result?.error) {
      router.push(`/dashboard?date=${getDateStr(date)}`);
    }
  }

  function handleCancel() {
    router.push(`/dashboard?date=${getDateStr(date)}`);
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

      <div className="flex gap-2">
        <Button type="submit" className="w-fit">
          Create Workout
        </Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
