"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date;
}

export function DatePicker({ date }: DatePickerProps) {
  const router = useRouter();

  function handleSelect(day: Date | undefined) {
    if (!day) return;
    router.push(`?date=${format(day, "yyyy-MM-dd")}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-56 justify-start gap-2">
          <CalendarIcon className="h-4 w-4" />
          {format(date, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
