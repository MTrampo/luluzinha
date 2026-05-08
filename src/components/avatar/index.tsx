import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/commons/lib/tw-merge"

interface StandardAvatarProps {
  initials: string
  size?: "default" | "sm" | "lg" | "xl"
  className?: string
}

export function StandardAvatar({ initials, size = "default", className }: StandardAvatarProps) {
  return (
    <Avatar size={size} className={cn("border-2 border-white shadow-sm shrink-0", className)}>
      <AvatarFallback className="bg-linear-to-br from-purple-100 to-pink-50 text-purple-700 font-bold">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
