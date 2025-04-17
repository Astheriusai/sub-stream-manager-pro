
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PriceList } from "./types";

type EditPriceDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPrice: PriceList | null;
};

export function EditPriceDialog({ isOpen, onOpenChange, selectedPrice }: EditPriceDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [price, setPrice] = useState(selectedPrice?.price.toString() || '');

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PriceList> }) => {
      const { data: price, error } = await supabase
        .from('price_lists')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return price;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price_list'] });
      onOpenChange(false);
      toast({
        title: 'Precio actualizado',
        description: 'El precio ha sido actualizado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo actualizar el precio: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPrice || !price) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese un precio válido',
        variant: 'destructive',
      });
      return;
    }

    updatePriceMutation.mutate({
      id: selectedPrice.id,
      data: { price: parseFloat(price) },
    });
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
            <Button type="submit" disabled={updatePriceMutation.isPending}>
              {updatePriceMutation.isPending ? (
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
