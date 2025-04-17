
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PriceListHeader } from "@/components/price-list/PriceListHeader";
import { PriceTable } from "@/components/price-list/PriceTable";
import { AddPriceDialog } from "@/components/price-list/AddPriceDialog";
import { EditPriceDialog } from "@/components/price-list/EditPriceDialog";
import { usePriceList } from "@/hooks/use-price-list";
import { PriceList as PriceListType } from "@/components/price-list/types";

// This would typically come from an auth context
const CURRENT_SUBSCRIBER_ID = "12345";

export default function PriceList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceListType | null>(null);
  
  const { priceList, products, isLoading } = usePriceList(CURRENT_SUBSCRIBER_ID);

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (price: PriceListType) => {
    setSelectedPrice(price);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PriceListHeader onAddClick={handleAddClick} />
      
      <Card>
        <CardContent className="p-6">
          <PriceTable 
            prices={priceList || []} 
            isLoading={isLoading} 
            onEdit={handleEditClick} 
          />
        </CardContent>
      </Card>

      <AddPriceDialog 
        isOpen={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        subscriberId={CURRENT_SUBSCRIBER_ID}
        products={products || []}
      />

      {selectedPrice && (
        <EditPriceDialog 
          isOpen={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          selectedPrice={selectedPrice}
          products={products || []}
        />
      )}
    </div>
  );
}
