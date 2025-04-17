
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/components/products/types';

export function useProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: Omit<Product, 'id' | 'created_at'>) => {
      const { data: product, error } = await supabase
        .from('products')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto creado',
        description: 'El producto ha sido creado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo crear el producto: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo actualizar el producto: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: accounts, error: checkError } = await supabase
        .from('accounts')
        .select('id')
        .eq('product_id', id)
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (accounts && accounts.length > 0) {
        throw new Error('No se puede eliminar porque tiene cuentas asociadas');
      }
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado exitosamente',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `No se pudo eliminar el producto: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    products,
    isLoading,
    error,
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isAdding: addProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
}
