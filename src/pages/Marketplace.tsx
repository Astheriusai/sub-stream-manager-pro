
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Marketplace() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
        <p className="text-muted-foreground">
          Plataforma interna para proveedores y clientes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
          <CardDescription>
            Explora proveedores y productos disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí podrás ver un listado de proveedores, productos ofrecidos y acceder al chat integrado para comunicarte con ellos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
