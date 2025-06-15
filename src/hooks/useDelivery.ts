
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DeliveryLocation {
  id: string;
  region: string;
  city: string;
  fee: number;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const fetchDeliveryLocations = async (): Promise<DeliveryLocation[]> => {
  const { data, error } = await supabase
    .from('delivery_locations')
    .select('*')
    .eq('is_active', true)
    .order('city', { ascending: true });

  if (error) {
    console.error('Error fetching delivery locations:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useDelivery = () => {
  const { data: locations, isLoading, isError } = useQuery<DeliveryLocation[]>({
    queryKey: ['deliveryLocations'],
    queryFn: fetchDeliveryLocations,
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
  });

  return {
    locations,
    isLoading,
    isError,
  };
};
