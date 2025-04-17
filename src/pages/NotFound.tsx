
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-medium mt-4">Página no encontrada</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        La página que estás buscando no existe o ha sido movida.
      </p>
      <Button onClick={() => navigate("/")}>
        Volver al Dashboard
      </Button>
    </div>
  );
}
