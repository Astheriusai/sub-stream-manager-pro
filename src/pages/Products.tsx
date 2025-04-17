
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/use-products';
import { ProductsTable } from '@/components/products/ProductsTable';
import { ProductsHeader } from '@/components/products/ProductsHeader';
import { ProductDialogs } from '@/components/products/ProductDialogs';
import { useProductDialogs } from '@/components/products/hooks/useProductDialogs';
import type { Product, ProductFormData } from '@/components/products/types';

export default function Products() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedProduct,
    setSelectedProduct,
  } = useProductDialogs();
  
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

  const handleAddClick = () => {
    resetForm();
    setIsAddDialogOpen(true);
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

  // Fixed this function to handle string id instead of Product object
  const handleDeleteClick = (id: string) => {
    const product = products?.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedProduct) return;
    deleteProduct(selectedProduct.id);
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleManageAccounts = (product: Product) => {
    navigate(`/accounts?product=${product.id}`);
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
      <ProductsHeader onAddClick={handleAddClick} />
      
      <Card>
        <CardContent className="p-6">
          <ProductsTable
            products={products || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onManageAccounts={handleManageAccounts}
            isDeletingProduct={isDeleting}
          />
        </CardContent>
      </Card>

      <ProductDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedProduct={selectedProduct}
        formData={formData}
        setFormData={setFormData}
        handleAddSubmit={handleAddSubmit}
        handleEditSubmit={handleEditSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
        isAdding={isAdding}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        toggleDuration={toggleDuration}
      />
    </div>
  );
}
