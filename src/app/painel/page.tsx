import { CardWeekDay } from "@/components/cards/card-week-day";
import Header from "@/components/header/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  return (
    <>
      <Header title="Início" />
      <div className="main-content">
        <h4 className="text-purple-900">Semana</h4>
        <CardWeekDay />
      </div>
    </>
  )
}