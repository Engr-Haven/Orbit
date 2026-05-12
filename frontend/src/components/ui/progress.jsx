import * as React from "react";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef(({ className, value, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-muted shadow-inner",
      className
    )}
    {...props}
  >
    <div
      className={cn(
        "h-full w-full flex-1 transition-all duration-700 ease-out rounded-full",
        variant === "gradient" && "gradient-primary shadow-sm shadow-purple-500/30",
        variant === "success" && "gradient-success shadow-sm shadow-emerald-500/30",
        variant === "warning" && "gradient-warning shadow-sm shadow-amber-500/30",
        variant === "error" && "gradient-error shadow-sm shadow-red-500/30",
        variant === "default" && "bg-primary"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
