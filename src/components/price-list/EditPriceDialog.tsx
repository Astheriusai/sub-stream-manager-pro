import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PriceList, Product } from "./types";

type EditPriceDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPrice: PriceList;
  products: Product[];
  onSubmit: (price: number) => Promise<void>;
  isSubmitting: boolean;
};

export function EditPriceDialog({ 
  isOpen, 
  onOpenChange, 
  selectedPrice, 
  products,
  onSubmit,
  isSubmitting 
}: EditPriceDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [price, setPrice] = useState(selectedPrice?.price.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese un precio válido',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(parseFloat(price));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Precio</DialogTitle>
          <DialogDescription>
            Actualiza el precio de venta para este producto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-product">Producto</Label>
              <Input
                id="edit-product"
                value={selectedPrice?.product_name || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Precio de Venta</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
