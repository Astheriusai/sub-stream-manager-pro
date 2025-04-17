
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { PriceList, Product } from "@/components/price-list/types";

export function usePriceList(subscriberId: string | undefined) {
  const { data: priceList, isLoading: isPriceListLoading } = useQuery({
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
        .eq('subscriber_id', subscriberId || '')
        .order('created_at');
      
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        product_name: item.products && typeof item.products === 'object' ? item.products.name : undefined
      })) as PriceList[];
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

  return {
    priceList,
    products,
    isLoading: isPriceListLoading
  };
}
