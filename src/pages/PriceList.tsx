
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { PriceListHeader } from '@/components/price-list/PriceListHeader';
import { AddPriceDialog } from '@/components/price-list/AddPriceDialog';
import { EditPriceDialog } from '@/components/price-list/EditPriceDialog';
import { PriceTable } from '@/components/price-list/PriceTable';
import { usePriceList } from '@/hooks/use-price-list';
import type { PriceList } from '@/components/price-list/types';

export default function PriceList() {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceList | null>(null);
  
  const { priceList, products, isLoading } = usePriceList(user?.subscriber_id);

  const handleEdit = (price: PriceList) => {
    setSelectedPrice(price);
    setIsEditDialogOpen(true);
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
      <PriceListHeader onAddClick={() => setIsAddDialogOpen(true)} />
      
      <Card>
        <CardContent className="p-6">
          <PriceTable 
            prices={priceList || []}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <AddPriceDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        subscriberId={user.subscriber_id}
        products={products || []}
      />

      <EditPriceDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedPrice={selectedPrice}
      />
    </div>
  );
}
