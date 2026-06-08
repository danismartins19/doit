import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11.5px] font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-chip text-ink-2",
        overdue: "border-transparent bg-overdue-soft text-overdue",
        soon: "border-transparent text-status-pending",
        outline: "border-line-2 text-ink-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
