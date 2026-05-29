"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>) {
  const pct = value ?? 0;
  const color = pct >= 70 ? "#ef4444" : pct >= 40 ? "#f59e0b" : "#525252";

  return (
    <ProgressPrimitive.Root
      className={cn("relative h-1 w-full overflow-hidden bg-[var(--muted)]", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - pct}%)`, background: color }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
