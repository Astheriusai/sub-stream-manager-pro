
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PriceListHeader } from "@/components/price-list/PriceListHeader";
import { PriceTable } from "@/components/price-list/PriceTable";
import { AddPriceDialog } from "@/components/price-list/AddPriceDialog";
import { EditPriceDialog } from "@/components/price-list/EditPriceDialog";
import { usePriceList } from "@/hooks/use-price-list";
import { usePriceDialogs } from "@/hooks/use-price-dialogs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const CURRENT_SUBSCRIBER_ID = "12345";

export default function PriceList() {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedPrice,
    setSelectedPrice,
    handleAddClick,
    handleEditClick,
    handleDeleteClick
  } = usePriceDialogs();
  
  const { 
    priceList, 
    products, 
    isLoading,
    addPrice,
    updatePrice, 
    deletePrice 
  } = usePriceList(CURRENT_SUBSCRIBER_ID);

  const handleDelete = async () => {
    if (!selectedPrice) return;
    
    try {
      await deletePrice.mutateAsync(selectedPrice.id);
      setIsDeleteDialogOpen(false);
      setSelectedPrice(null);
    } catch (error) {
      console.error("Error deleting price:", error);
    }
  };

  const handleAddPrice = async (productId: string, price: number) => {
    try {
      await addPrice.mutateAsync({
        subscriber_id: CURRENT_SUBSCRIBER_ID,
        product_id: productId,
        price
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding price:", error);
    }
  };

  const handleUpdatePrice = async (priceId: string, newPrice: number) => {
    try {
      await updatePrice.mutateAsync({
        id: priceId,
        price: newPrice
      });
      setIsEditDialogOpen(false);
      setSelectedPrice(null);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PriceListHeader onAddClick={handleAddClick} />
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Precios</CardTitle>
          <CardDescription>
            Configura los precios para cada servicio que ofreces a tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <PriceTable 
            prices={priceList || []} 
            isLoading={isLoading} 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      <AddPriceDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        subscriberId={CURRENT_SUBSCRIBER_ID}
        products={products || []}
        onSubmit={handleAddPrice}
        isSubmitting={addPrice.isPending}
      />

      {selectedPrice && (
        <EditPriceDialog 
          isOpen={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          selectedPrice={selectedPrice}
          products={products || []}
          onSubmit={(price) => handleUpdatePrice(selectedPrice.id, price)}
          isSubmitting={updatePrice.isPending}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el precio para el producto{" "}
              <span className="font-medium">{selectedPrice?.product_name}</span>. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deletePrice.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePrice.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
