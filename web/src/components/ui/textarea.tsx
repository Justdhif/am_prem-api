import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-gray-700/80 bg-[#0d121f] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-[#00e599] transition disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
