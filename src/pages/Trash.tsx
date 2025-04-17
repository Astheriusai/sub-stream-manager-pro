
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Trash() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Papelera</h2>
        <p className="text-muted-foreground">
          Recupera elementos eliminados recientemente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Elementos Eliminados</CardTitle>
          <CardDescription>
            Elementos que han sido eliminados recientemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí podrás ver y recuperar elementos que han sido eliminados recientemente, como productos, clientes, cuentas o ventas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
