import { CardWeekDay } from "@/components/cards/card-week-day";
import Header from "@/components/header/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  return (
    <>
      <Header title="Início"/>
      <div className="main-content">
        <h4>Semana</h4>
        <CardWeekDay/>
        {/* <Card size="sm" className="mx-auto w-full">
          <CardHeader>
            <CardTitle>Small Card</CardTitle>
            <CardDescription>
              This card uses the small size variant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The card component supports a size prop that can be set to
              &quot;sm&quot; for a more compact appearance.
            </p>
          </CardContent>
        </Card> */}
      </div>
    </>
  )
}