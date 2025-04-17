
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Product } from "./types";

type AddPriceDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subscriberId: string;
  products: Product[];
};

export function AddPriceDialog({ isOpen, onOpenChange, subscriberId, products }: AddPriceDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    product_id: '',
    price: '',
  });

  const addPriceMutation = useMutation({
    mutationFn: async (data: { subscriber_id: string; product_id: string; price: number }) => {
      const { data: price, error } = await supabase
        .from('price_lists')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return price;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price_list'] });
      onOpenChange(false);
      resetForm();
      toast({
        title: 'Precio añadido',
        description: 'El precio ha sido añadido exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo añadir el precio: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      product_id: '',
      price: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product_id || !formData.price) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    addPriceMutation.mutate({
      subscriber_id: subscriberId,
      product_id: formData.product_id,
      price: parseFloat(formData.price),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Precio</DialogTitle>
          <DialogDescription>
            Establece el precio de venta para un producto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product_id">Producto</Label>
              <Select 
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger id="product_id">
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Precio de Venta</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ej: 29.99"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={addPriceMutation.isPending}>
              {addPriceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
