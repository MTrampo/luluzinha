import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/commons/lib/tw-merge"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold shadow-xs shadow-purple-100",
        secondary:
          "bg-purple-50 hover:bg-purple-100/90 active:bg-purple-200/90 text-purple-700 hover:text-purple-800 font-bold border border-purple-200/70 shadow-2xs",
        outline:
          "border border-purple-200 bg-white hover:bg-purple-50 hover:text-purple-800 text-purple-700 font-bold shadow-2xs",
        ghost:
          "hover:bg-purple-50 hover:text-purple-800 text-purple-900 font-medium",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 font-bold shadow-xs",
        success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 disabled:opacity-100 font-bold shadow-xs",
        link: "text-purple-600 underline-offset-4 hover:underline font-semibold",
        menu: "hover:bg-purple-50 hover:text-purple-800 justify-start w-full font-medium",
        theme: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold shadow-xs",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button"

    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
