import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionMenu } from "../menu";
import { FaClock } from "react-icons/fa6";

export function ServiceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pé e Mão</CardTitle>
        <CardAction>
          <ActionMenu />
        </CardAction>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <CardDescription className="flex items-center gap-1">
          <FaClock/> 45min
        </CardDescription>
        <span className="block font-medium">R$ 50,00</span>
      </CardContent>
    </Card>
  )
}