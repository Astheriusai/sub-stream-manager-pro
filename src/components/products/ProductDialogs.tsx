
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import { DeleteProductDialog } from './DeleteProductDialog';
import type { Product, ProductFormData } from './types';

interface ProductDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  handleAddSubmit: (e: React.FormEvent) => void;
  handleEditSubmit: (e: React.FormEvent) => void;
  handleDeleteConfirm: () => void;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  toggleDuration: (duration: number) => void;
}

export function ProductDialogs({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedProduct,
  formData,
  setFormData,
  handleAddSubmit,
  handleEditSubmit,
  handleDeleteConfirm,
  isAdding,
  isUpdating,
  isDeleting,
  toggleDuration,
}: ProductDialogsProps) {
  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedProduct={selectedProduct}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
}
