"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

function SheetPortal(props: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/60", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  side?: "left" | "right" | "top" | "bottom";
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col bg-[var(--card)] border-[var(--border)]",
          "transition-transform duration-200 ease-out",
          side === "right" && "inset-y-0 right-0 h-full w-80 border-l",
          side === "left" && "inset-y-0 left-0 h-full w-80 border-r",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <DialogPrimitive.Title className="text-xs font-mono uppercase tracking-widest text-[var(--muted-foreground)]">
            Detail
          </DialogPrimitive.Title>
          <DialogPrimitive.Close className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <X size={14} />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-sm font-medium text-[var(--foreground)]", className)}
      {...props}
    />
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle };
