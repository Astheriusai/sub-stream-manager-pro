
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Roles() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Roles y Permisos</h2>
        <p className="text-muted-foreground">
          Define roles y controla qué puede hacer cada usuario
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Roles</CardTitle>
          <CardDescription>
            Administra los roles del sistema y sus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí podrás ver y configurar los diferentes roles del sistema, así como los permisos asociados a cada uno.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
