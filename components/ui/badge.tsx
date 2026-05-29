import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-xs font-mono transition-colors",
  {
    variants: {
      variant: {
        default: "border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)]",
        high: "border-red-500/20 bg-red-500/10 text-red-500",
        medium: "border-amber-500/20 bg-amber-500/10 text-amber-500",
        low: "border-transparent bg-transparent text-[var(--muted-foreground)]",
        outline: "border-[var(--border)] bg-transparent text-[var(--foreground)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
