"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

type Theme = "light" | "dark" | "system";

const options: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1">
      {options.map(({ value, label }) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
