# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

Do not create custom components. If a UI element is needed, use the appropriate shadcn/ui component. If shadcn/ui does not provide a component for a specific use case, compose existing shadcn/ui primitives together — do not build from scratch.

### Adding Components

Install shadcn/ui components via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components are installed into `src/components/ui/` and can be imported from `@/components/ui/<component-name>`.

## Date Formatting

Use [date-fns](https://date-fns.org/) for all date formatting. Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use `format` from `date-fns` with the `do MMM yyyy` format string:

```ts
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy"); // "2nd Aug 2025"
```

Do not use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting method.
