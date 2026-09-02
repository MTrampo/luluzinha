import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaClock } from "react-icons/fa6";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { CardActionMenu } from "./menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/commons/lib/tw-merge";

type ProceduresCardProps = {
  procedure: ProcedureFormatted;
}

export function ProceduresCard({ procedure }: ProceduresCardProps) {
  return (
    <Card className={cn(
      "group hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[120px]",
      !procedure.isActive && "opacity-60 bg-muted/40"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="leading-tight group-hover:text-primary transition-colors">
            {procedure.nameFormatted}
          </CardTitle>
          {!procedure.isActive && (
            <Badge variant="destructive" className="h-4 text-[9px] px-1.5 py-0">Inativo</Badge>
          )}
        </div>

        {procedure.description && (
          <CardDescription className="line-clamp-2 text-xs mt-1">
            {procedure.description}
          </CardDescription>
        )}

        <CardAction>
          <CardActionMenu procedure={procedure} />
        </CardAction>
      </CardHeader>

      <CardContent className="pt-3 flex justify-between items-end mt-auto gap-2 border-t">
        <CardDescription className="flex items-center gap-1.5 font-medium">
          <FaClock className="text-primary/70" /> {procedure.durationFormatted}
        </CardDescription>

        <Badge variant="secondary" className="px-2.5 py-0.5 text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20">
          {procedure.priceFormatted}
        </Badge>
      </CardContent>
    </Card>
  )
}