import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent gradient-primary text-white shadow-purple-500/20",
        secondary: "border-transparent bg-secondary text-secondary-foreground shadow-amber-500/20",
        destructive: "border-transparent gradient-error text-white shadow-red-500/20",
        outline: "text-foreground border-border",
        success: "border-transparent gradient-success text-white shadow-emerald-500/20",
        warning: "border-transparent gradient-warning text-white shadow-amber-500/20",
        info: "border-transparent gradient-info text-white shadow-indigo-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
