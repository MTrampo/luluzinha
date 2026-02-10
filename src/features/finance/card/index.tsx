import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

type CardFinanceProps = {
  title: string
  amount: string
  percentage: ReactNode
  description: ReactNode
  last: string
}

export function CardFinance({ title, amount, percentage, description, last }: CardFinanceProps) {
  return (
    <Card className="gap-0">
      <CardHeader>
        <CardDescription>
          {title}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {amount}
        </CardTitle>
        <CardAction>
          {percentage}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm bg-background border-none">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description}
        </div>
        <div className="text-muted-foreground">
          {last}
        </div>
      </CardFooter>
    </Card>
  )
}