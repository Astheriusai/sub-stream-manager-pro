
import { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductsTable } from '@/components/products/ProductsTable';
import type { Product, ProductFormData } from '@/components/products/types';

export default function Products() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { 
    products, 
    isLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    isAdding,
    isUpdating,
    isDeleting,
  } = useProducts();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    base_price: '',
    max_profiles: '',
    allowed_durations: [1, 3, 6, 12],
    status: true,
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
    
    if (!formData.name || !formData.base_price || !formData.max_profiles) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    addProduct({
      name: formData.name,
      base_price: parseFloat(formData.base_price),
      max_profiles: parseInt(formData.max_profiles),
      allowed_durations: formData.allowed_durations,
      status: formData.status ? 'active' : 'inactive',
    });
    setIsAddDialogOpen(false);
    resetForm();
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    if (!formData.name || !formData.base_price || !formData.max_profiles) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    updateProduct({
      id: selectedProduct.id,
      data: {
        name: formData.name,
        base_price: parseFloat(formData.base_price),
        max_profiles: parseInt(formData.max_profiles),
        allowed_durations: formData.allowed_durations,
        status: formData.status ? 'active' : 'inactive',
      }
    });
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
    resetForm();
  };

  const handleManageAccounts = (product: Product) => {
    // TODO: Navigate to accounts filtered by this product
    toast({
      title: 'Gestionar Cuentas',
      description: `Redirigiendo a cuentas de ${product.name}`,
    });
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
            <ProductForm
              onSubmit={handleAddSubmit}
              formData={formData}
              setFormData={setFormData}
              isLoading={isAdding}
              toggleDuration={toggleDuration}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <ProductsTable
            products={products || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={deleteProduct}
            onManageAccounts={handleManageAccounts}
            isDeletingProduct={isDeleting}
          />
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
          <ProductForm
            onSubmit={handleEditSubmit}
            formData={formData}
            setFormData={setFormData}
            isLoading={isUpdating}
            toggleDuration={toggleDuration}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
