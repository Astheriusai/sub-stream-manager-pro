
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PriceList, Product } from "@/components/price-list/types";
import { useToast } from "@/hooks/use-toast";

export function usePriceList(subscriberId: string | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: priceList, isLoading: isPriceListLoading } = useQuery({
    queryKey: ['price_list', subscriberId],
    queryFn: async () => {
      if (!subscriberId) return [];
      
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
        .eq('subscriber_id', subscriberId)
        .order('created_at');
      
      if (error) throw error;
      
      return data.map(item => {
        // Check if products exists and properly handle its structure
        // It could be an array or an object depending on how Supabase returns it
        let productName;
        if (item.products) {
          if (Array.isArray(item.products) && item.products.length > 0) {
            productName = item.products[0].name;
          } else if (typeof item.products === 'object') {
            productName = (item.products as any).name;
          }
        }
        
        return {
          ...item,
          product_name: productName
        };
      }) as PriceList[];
    },
    enabled: !!subscriberId,
  });

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

  // Add a new price to the price list
  const addPrice = useMutation({
    mutationFn: async (newPrice: { 
      subscriber_id: string, 
      product_id: string, 
      price: number 
    }) => {
      const { data, error } = await supabase
        .from('price_lists')
        .upsert([
          {
            subscriber_id: newPrice.subscriber_id,
            product_id: newPrice.product_id,
            price: newPrice.price
          }
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price_list', subscriberId] });
      toast({
        title: "Precio añadido",
        description: "El precio se ha añadido correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al añadir el precio: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update an existing price
  const updatePrice = useMutation({
    mutationFn: async (updatedPrice: { 
      id: string, 
      price: number 
    }) => {
      const { data, error } = await supabase
        .from('price_lists')
        .update({ price: updatedPrice.price })
        .eq('id', updatedPrice.id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price_list', subscriberId] });
      toast({
        title: "Precio actualizado",
        description: "El precio se ha actualizado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al actualizar el precio: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete a price from the price list
  const deletePrice = useMutation({
    mutationFn: async (priceId: string) => {
      const { error } = await supabase
        .from('price_lists')
        .delete()
        .eq('id', priceId);

      if (error) throw error;
      return priceId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price_list', subscriberId] });
      toast({
        title: "Precio eliminado",
        description: "El precio se ha eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Error al eliminar el precio: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    priceList,
    products,
    isLoading: isPriceListLoading,
    addPrice,
    updatePrice,
    deletePrice
  };
}
