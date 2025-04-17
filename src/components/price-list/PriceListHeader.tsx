
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type PriceListHeaderProps = {
  onAddClick: () => void;
};

export function PriceListHeader({ onAddClick }: PriceListHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lista de Precios</h2>
        <p className="text-muted-foreground">
          Gestiona los precios de venta para cada producto
        </p>
      </div>
      <Button onClick={onAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Añadir Precio
      </Button>
    </div>
  );
}
