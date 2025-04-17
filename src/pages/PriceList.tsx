
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { PlusCircle, Pencil, Trash2, Info, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/lib/auth';

type PriceList = {
  id: string;
  subscriber_id: string;
  product_id: string;
  price: number;
  created_at: string;
  product_name?: string;
};

type Product = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
};

export default function PriceList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceList | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    product_id: '',
    price: '',
  });

  // Fetch price list
  const { data: priceList, isLoading, error } = useQuery({
    queryKey: ['price_list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_lists')
        .select(`
          id,
          subscriber_id,
          product_id,
          price,
          created_at,
          products:product_id (name)
        `)
        .eq('subscriber_id', user?.subscriber_id || '')
        .order('created_at');
      
      if (error) throw error;
      
      // Transform data to include product name
      const transformedData = data.map(item => ({
        ...item,
        product_name: item.products?.name
      }));
      
      return transformedData as PriceList[];
    },
    enabled: !!user?.subscriber_id,
  });

  // Fetch products for dropdown
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, status')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
  });

  // Add price mutation
  const addPriceMutation = useMutation({
    mutationFn: async (data: Omit<PriceList, 'id' | 'created_at' | 'product_name'>) => {
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
      setIsAddDialogOpen(false);
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

  // Update price mutation
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
      setIsEditDialogOpen(false);
      setSelectedPrice(null);
      resetForm();
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

  // Delete price mutation
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

  const resetForm = () => {
    setFormData({
      product_id: '',
      price: '',
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.product_id || !formData.price) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.subscriber_id) {
      toast({
        title: 'Error',
        description: 'No se puede asignar el precio sin un suscriptor',
        variant: 'destructive',
      });
      return;
    }

    // Convert form data to price data
    const priceData = {
      subscriber_id: user.subscriber_id,
      product_id: formData.product_id,
      price: parseFloat(formData.price),
    };

    addPriceMutation.mutate(priceData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPrice) return;
    
    // Validate form
    if (!formData.price) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese un precio válido',
        variant: 'destructive',
      });
      return;
    }

    // Convert form data to price data
    const priceData = {
      price: parseFloat(formData.price),
    };

    updatePriceMutation.mutate({ id: selectedPrice.id, data: priceData });
  };

  const handleEdit = (price: PriceList) => {
    setSelectedPrice(price);
    setFormData({
      product_id: price.product_id,
      price: price.price.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deletePriceMutation.mutate(id);
  };

  if (!user?.subscriber_id) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lista de Precios</h2>
          <p className="text-muted-foreground">
            Gestiona los precios de venta para cada producto
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No se ha asignado un suscriptor</p>
              <p className="text-muted-foreground mt-2">
                Debes estar asociado a un suscriptor para gestionar la lista de precios
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lista de Precios</h2>
          <p className="text-muted-foreground">
            Gestiona los precios de venta para cada producto
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Precio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Precio</DialogTitle>
              <DialogDescription>
                Establece el precio de venta para un producto
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
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
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-destructive">Error al cargar los precios</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Precio de Venta</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceList && priceList.length > 0 ? (
                  priceList.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell className="font-medium">{price.product_name}</TableCell>
                      <TableCell>{formatCurrency(price.price)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(price)}
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
                                  onClick={() => handleDelete(price.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Edit Price Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Precio</DialogTitle>
            <DialogDescription>
              Actualiza el precio de venta para este producto
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
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
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
    </div>
  );
}
