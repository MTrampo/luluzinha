import { Checkbox } from "../ui/checkbox"
import { cn } from "@/commons/lib/tw-merge"

export function FilterItem({
  label,
  id,
  checked,
  onChange,
  color = "data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600",
  activeClass = "bg-purple-50/50 border-purple-200 text-purple-900",
  hoverClass = "hover:border-purple-100",
  labelClass = "text-gray-600"
}: {
  label: string;
  id: string;
  checked: boolean;
  onChange: () => void;
  color?: string;
  activeClass?: string;
  hoverClass?: string;
  labelClass?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer group",
        checked ? activeClass : cn("bg-white border-transparent", hoverClass)
      )}
      onClick={onChange}
    >
      <span className={cn("text-xs font-semibold transition-colors", checked ? "" : labelClass)}>
        {label}
      </span>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "h-5 w-5 border-purple-200 rounded-md transition-all",
          checked ? color : "bg-white"
        )}
      />
    </div>
  )
}