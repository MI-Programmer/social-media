import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "primary" | "transparent";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary:
        "px-3 py-2 border-input shadow-sm focus-visible:ring-1 focus-visible:ring-ring",
      transparent: "",
    };

    return (
      <textarea
        className={cn(
          `flex min-h-[60px] w-full resize-none rounded-md border bg-transparent text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
