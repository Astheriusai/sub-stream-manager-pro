
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function Accounts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cuentas</h2>
          <p className="text-muted-foreground">
            Gestiona el inventario de cuentas de servicios
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Cuenta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventario de Cuentas</CardTitle>
          <CardDescription>
            Administra todas las cuentas de servicios disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí verás una tabla con todas las cuentas registradas, sus detalles y estado.
            Podrás filtrar, buscar y gestionar cada cuenta y sus perfiles asociados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
