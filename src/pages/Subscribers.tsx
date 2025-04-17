
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function Subscribers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suscriptores</h2>
          <p className="text-muted-foreground">
            Gestiona los suscriptores que usan este sistema
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Suscriptor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suscriptores del Sistema</CardTitle>
          <CardDescription>
            Administra las diferentes instancias de este sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí verás una tabla con todos los suscriptores registrados, su estado, fechas de suscripción y configuraciones asociadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
