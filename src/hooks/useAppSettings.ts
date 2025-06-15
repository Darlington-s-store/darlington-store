
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// This type must match the columns in your 'app_settings' table
export interface AppSettings {
  id?: number;
  site_name: string;
  site_description: string;
  contact_email: string;
  support_email: string;
  phone: string;
  address: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  order_updates: boolean;
  promotional_emails: boolean;
  maintenance_mode: boolean;
  allow_guest_checkout: boolean;
  require_email_verification: boolean;
  auto_approve_reviews: boolean;
  logo_url: string | null;
  favicon_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// Fetches the single row of settings from the database
const fetchSettings = async (): Promise<AppSettings | null> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    throw new Error(error.message);
  }

  return data;
};

// Updates the settings in the database
const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
    // Exclude fields that shouldn't be updated directly
    const { id, created_at, updated_at, ...updateData } = settings;

    const { data, error } = await supabase
        .from('app_settings')
        .update(updateData)
        .eq('id', 1)
        .select()
        .single();

    if (error) {
        console.error('Error updating settings:', error);
        throw new Error(error.message);
    }
    
    return data as AppSettings;
};

// Custom hook to manage app settings state
export const useAppSettings = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: settings, isLoading, isError, error } = useQuery<AppSettings | null>({
        queryKey: ['appSettings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    const mutation = useMutation({
        mutationFn: updateSettings,
        onSuccess: (data) => {
            queryClient.setQueryData(['appSettings'], data);
            toast({
                title: 'Success!',
                description: 'Settings have been saved successfully.',
            });
        },
        onError: (err: Error) => {
            toast({
                title: 'Error Saving Settings',
                description: err.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        },
    });

    return {
        settings,
        isLoading,
        isError,
        error,
        updateSettings: mutation.mutate,
        isUpdating: mutation.isPending,
    };
};
