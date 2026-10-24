import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border border-[#00e599]/30 bg-[#00e599]/15 text-[#00e599]",
        secondary:
          "border border-gray-700/60 bg-gray-800 text-gray-300",
        destructive:
          "border border-red-500/30 bg-red-500/15 text-red-400",
        outline: "text-gray-300 border border-gray-700",
        methodPost:
          "border border-[#00e599]/40 bg-[#00e599]/20 text-[#00e599] font-mono font-bold text-[11px]",
        methodGet:
          "border border-blue-500/40 bg-blue-500/20 text-blue-400 font-mono font-bold text-[11px]",
        anon:
          "border border-gray-700/60 bg-[#1f2937] text-gray-400 text-[9px] font-normal px-1.5 py-0.5 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
