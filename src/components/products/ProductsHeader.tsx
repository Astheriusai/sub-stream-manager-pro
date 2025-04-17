
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ProductsHeaderProps {
  onAddClick: () => void;
}

export function ProductsHeader({ onAddClick }: ProductsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
        <p className="text-muted-foreground">
          Gestiona los tipos de suscripciones que ofreces
        </p>
      </div>
      <Button onClick={onAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Añadir Producto
      </Button>
    </div>
  );
}
