import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Pencil, Database, Trash2, Info, Check, X, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils/formatCurrency';

type Product = {
  id: string;
  name: string;
  base_price: number;
  max_profiles: number;
  allowed_durations: number[];
  status: 'active' | 'inactive';
  created_at: string;
};

export default function Products() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    base_price: '',
    max_profiles: '',
    allowed_durations: [1, 3, 6, 12],
    status: true,
  });

  // Fetch products
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (data: Omit<Product, 'id' | 'created_at'>) => {
      const { data: product, error } = await supabase
        .from('products')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: 'Producto creado',
        description: 'El producto ha sido creado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo crear el producto: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      toast({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo actualizar el producto: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      // First check if product has accounts
      const { data: accounts, error: checkError } = await supabase
        .from('accounts')
        .select('id')
        .eq('product_id', id)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (accounts && accounts.length > 0) {
        throw new Error('No se puede eliminar porque tiene cuentas asociadas');
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo eliminar el producto: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      base_price: '',
      max_profiles: '',
      allowed_durations: [1, 3, 6, 12],
      status: true,
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.base_price || !formData.max_profiles) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    // Convert form data to product data
    const productData = {
      name: formData.name,
      base_price: parseFloat(formData.base_price),
      max_profiles: parseInt(formData.max_profiles),
      allowed_durations: formData.allowed_durations,
      status: formData.status ? 'active' : 'inactive' as 'active' | 'inactive',
    };

    addProductMutation.mutate(productData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    // Validate form
    if (!formData.name || !formData.base_price || !formData.max_profiles) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    // Convert form data to product data
    const productData = {
      name: formData.name,
      base_price: parseFloat(formData.base_price),
      max_profiles: parseInt(formData.max_profiles),
      allowed_durations: formData.allowed_durations,
      status: formData.status ? 'active' : 'inactive' as 'active' | 'inactive',
    };

    updateProductMutation.mutate({ id: selectedProduct.id, data: productData });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      base_price: product.base_price.toString(),
      max_profiles: product.max_profiles.toString(),
      allowed_durations: product.allowed_durations,
      status: product.status === 'active',
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const toggleDuration = (duration: number) => {
    if (formData.allowed_durations.includes(duration)) {
      setFormData({
        ...formData,
        allowed_durations: formData.allowed_durations.filter(d => d !== duration),
      });
    } else {
      setFormData({
        ...formData,
        allowed_durations: [...formData.allowed_durations, duration].sort((a, b) => a - b),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
          <p className="text-muted-foreground">
            Gestiona los tipos de suscripciones que ofreces
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Producto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Producto</DialogTitle>
              <DialogDescription>
                Crea un nuevo tipo de suscripción para ofrecer a tus clientes
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Netflix Premium"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="base_price">Precio Base</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                    placeholder="Ej: 14.99"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_profiles">Perfiles Máximos</Label>
                  <Input
                    id="max_profiles"
                    type="number"
                    value={formData.max_profiles}
                    onChange={(e) => setFormData({ ...formData, max_profiles: e.target.value })}
                    placeholder="Ej: 5"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Duraciones Permitidas (meses)</Label>
                  <div className="flex flex-wrap gap-4">
                    {[1, 3, 6, 12].map((duration) => (
                      <div key={duration} className="flex items-center space-x-2">
                        <Checkbox
                          id={`duration-${duration}`}
                          checked={formData.allowed_durations.includes(duration)}
                          onCheckedChange={() => toggleDuration(duration)}
                        />
                        <Label htmlFor={`duration-${duration}`} className="text-sm">{duration}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                  />
                  <Label htmlFor="status">Activo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={addProductMutation.isPending}>
                  {addProductMutation.isPending ? (
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
              <p className="text-destructive">Error al cargar los productos</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio Base</TableHead>
                  <TableHead>Perfiles Máximos</TableHead>
                  <TableHead>Duraciones Permitidas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{formatCurrency(product.base_price)}</TableCell>
                      <TableCell>{product.max_profiles}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.allowed_durations.map((duration) => (
                            <Badge key={duration} variant="outline">
                              {duration} mes{duration !== 1 ? 'es' : ''}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.status === 'active' ? 'default' : 'secondary'}
                        >
                          {product.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // TODO: Navigate to accounts filtered by this product
                              toast({
                                title: 'Gestionar Cuentas',
                                description: `Redirigiendo a cuentas de ${product.name}`,
                              });
                            }}
                          >
                            <Database className="h-4 w-4" />
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                                  "{product.name}" y podría afectar a las cuentas y ventas asociadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleteProductMutation.isPending ? (
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
                    <TableCell colSpan={6} className="text-center">
                      <div className="flex flex-col items-center justify-center h-24 gap-2">
                        <Info className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No hay productos registrados</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Actualiza la información del producto
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-base_price">Precio Base</Label>
                <Input
                  id="edit-base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-max_profiles">Perfiles Máximos</Label>
                <Input
                  id="edit-max_profiles"
                  type="number"
                  value={formData.max_profiles}
                  onChange={(e) => setFormData({ ...formData, max_profiles: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Duraciones Permitidas (meses)</Label>
                <div className="flex flex-wrap gap-4">
                  {[1, 3, 6, 12].map((duration) => (
                    <div key={duration} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-duration-${duration}`}
                        checked={formData.allowed_durations.includes(duration)}
                        onCheckedChange={() => toggleDuration(duration)}
                      />
                      <Label htmlFor={`edit-duration-${duration}`} className="text-sm">{duration}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-status"
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                />
                <Label htmlFor="edit-status">Activo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? (
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
