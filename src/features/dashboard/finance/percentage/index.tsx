
import { Badge } from "@/components/ui/badge";
import { JSX } from "react";
import { FaArrowTrendDown, FaArrowTrendUp, FaMinus } from "react-icons/fa6";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/commons/lib/tw-merge";

const percentageVariants = cva("inline-flex items-center gap-1 rounded-full", {
  variants: {
    status: {
      LOW: "",
      STABLE: "",
      HIGH: "",
    },
    negative: {
      true: "",
      false: "",
    },
    size: {
      sm: "px-1.5 text-xs",
      md: "px-2 text-sm",
    },
  },
  compoundVariants: [
    { status: "LOW", negative: true, className: "text-green-800 bg-green-100 border-green-800" },
    { status: "LOW", negative: false, className: "text-red-800 bg-red-100" },
    { status: "HIGH", negative: true, className: "text-red-800 bg-red-100" },
    { status: "HIGH", negative: false, className: "text-green-800 bg-green-100 border-green-800" },
    { status: "STABLE", className: "text-gray-800 bg-gray-200" },
  ],
  defaultVariants: {
    negative: false,
    size: "sm",
  },
});

interface PercentageStatusBadgeProps
  extends VariantProps<typeof percentageVariants> {
  className?: string;
  statusText?: string;
  status: "LOW" | "STABLE" | "HIGH";
}

export function PercentageBadge({
  negative = false,
  status,
  statusText,
  className,
  size = "sm",
}: PercentageStatusBadgeProps) {
  const statusIconMap: Record<"LOW" | "STABLE" | "HIGH", JSX.Element> = {
    LOW: negative ? <FaArrowTrendUp /> : <FaArrowTrendDown />,
    STABLE: <FaMinus />,
    HIGH: negative ? <FaArrowTrendDown /> : <FaArrowTrendUp />,
  };

  const statusIcon = statusIconMap[status];

  return (
    <Badge
      variant="outline"
      className={cn(percentageVariants({ status, negative, size }), className)}
    >
      {statusIcon}
      {statusText && <span>{statusText}</span>}
    </Badge>
  );
}