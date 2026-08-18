import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-silver cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-silver text-background hover:bg-foreground hover:text-background shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-line-strong bg-surface-2/60 text-foreground hover:bg-surface-2 hover:border-foreground/40",
        secondary:
          "bg-surface-2 text-secondary-foreground hover:bg-surface-2/80",
        ghost:
          "hover:bg-foreground/10 hover:text-foreground",
        link: "text-silver underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2.5 has-[>svg]:px-4",
        xs: "h-7 gap-1 rounded-md px-2.5 text-xs has-[>svg]:px-2",
        sm: "h-9 rounded-full gap-1.5 px-4 text-xs",
        lg: "h-12 rounded-full px-8 text-sm sm:text-base",
        icon: "size-10 rounded-full",
        "icon-xs": "size-7 rounded-md",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
