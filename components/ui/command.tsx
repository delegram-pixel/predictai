"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const Command = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive>) => (
  <CommandPrimitive
    className={cn(
      "flex h-full w-full flex-col overflow-hidden bg-[var(--card)]",
      className
    )}
    {...props}
  />
);

const CommandInput = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>) => (
  <div className="flex items-center border border-[var(--border)] px-2" cmdk-input-wrapper="">
    <Search size={12} className="text-[var(--muted-foreground)] mr-2 shrink-0" />
    <CommandPrimitive.Input
      className={cn(
        "flex h-7 w-full bg-transparent text-xs outline-none placeholder:text-[var(--muted-foreground)] font-mono",
        className
      )}
      {...props}
    />
  </div>
);

const CommandList = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List
    className={cn("max-h-60 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
);

const CommandEmpty = (
  props: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
) => (
  <CommandPrimitive.Empty
    className="py-6 text-center text-xs text-[var(--muted-foreground)]"
    {...props}
  />
);

const CommandItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center px-3 py-2 text-xs font-mono outline-none",
      "hover:bg-[var(--muted)] data-[selected=true]:bg-[var(--muted)]",
      className
    )}
    {...props}
  />
);

export { Command, CommandInput, CommandList, CommandEmpty, CommandItem };
