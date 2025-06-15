
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProductImage = () => {
  return useQuery({
    queryKey: ['hero-product-image'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('image_url, name')
        .not('image_url', 'is', null)
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching product image:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
