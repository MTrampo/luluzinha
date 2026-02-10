import Header from "@/components/header/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NavCalendar } from "@/features/schedule/nav-calendar";

export default async function Schedule() {
  return (
    <>
      <Header title="Agenda" />
      <div className="main-content flex-row relative mr-[75%] sm:mr-96">
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cliete 1</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Confirmar
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cliete 2</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Confirmar
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cliete 3</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Confirmar
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cliete 4</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Confirmar
              </Button>
            </CardFooter>
          </Card>
        </div>
        <NavCalendar />
      </div>
    </>
  )
}