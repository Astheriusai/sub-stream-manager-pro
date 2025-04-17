
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Info, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { PriceList } from "./types";

type PriceTableProps = {
  prices: PriceList[];
  onEdit: (price: PriceList) => void;
  isLoading?: boolean;
};

export function PriceTable({ prices, onEdit, isLoading }: PriceTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deletePriceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('price_lists')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price_list'] });
      toast({
        title: 'Precio eliminado',
        description: 'El precio ha sido eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo eliminar el precio: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Precio de Venta</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prices.length > 0 ? (
          prices.map((price) => (
            <TableRow key={price.id}>
              <TableCell className="font-medium">{price.product_name}</TableCell>
              <TableCell>{formatCurrency(price.price)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(price)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará el precio
                          establecido para este producto.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePriceMutation.mutate(price.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletePriceMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Eliminar'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center">
              <div className="flex flex-col items-center justify-center h-24 gap-2">
                <Info className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No hay precios registrados</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
