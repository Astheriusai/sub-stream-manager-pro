
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

  return {
    priceList,
    products,
    isLoading: isPriceListLoading
  };
}
