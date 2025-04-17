
import { useState } from 'react';
import { PriceList } from "@/components/price-list/types";

export function usePriceDialogs() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceList | null>(null);

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (price: PriceList) => {
    setSelectedPrice(price);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (price: PriceList) => {
    setSelectedPrice(price);
    setIsDeleteDialogOpen(true);
  };

  return {
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
  };
}
