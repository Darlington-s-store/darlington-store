
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

// Default settings to fallback to if none exist
const defaultSettings: AppSettings = {
  site_name: 'Darlington Store',
  site_description: "Ghana's Premier Electronics Store",
  contact_email: 'info@darlingtonstore.com',
  support_email: 'support@darlingtonstore.com',
  phone: '+233 24 123 4567',
  address: '123 Oxford Street, Osu, Accra, Ghana',
  email_notifications: true,
  sms_notifications: false,
  order_updates: true,
  promotional_emails: true,
  maintenance_mode: false,
  allow_guest_checkout: true,
  require_email_verification: true,
  auto_approve_reviews: false,
  logo_url: null,
  favicon_url: null,
};

// Fetches the single row of settings from the database
const fetchSettings = async (): Promise<AppSettings> => {
  console.log('Fetching app settings...');
  
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching settings:', error);
      return defaultSettings;
    }

    if (!data) {
      console.log('No settings found, creating default settings...');
      const { data: newData, error: insertError } = await supabase
        .from('app_settings')
        .insert({ ...defaultSettings, id: 1 })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating default settings:', insertError);
        return defaultSettings;
      }
      
      return newData as AppSettings;
    }

    console.log('Settings fetched successfully:', data);
    return data as AppSettings;
  } catch (err) {
    console.error('Unexpected error fetching settings:', err);
    return defaultSettings;
  }
};

// Updates the settings in the database
const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
    console.log('Updating settings:', settings);
    
    // Exclude fields that shouldn't be updated directly
    const { id, created_at, updated_at, ...updateData } = settings;

    // First, let's check if the record exists
    const { data: existingData, error: checkError } = await supabase
        .from('app_settings')
        .select('id')
        .eq('id', 1)
        .maybeSingle();

    if (checkError) {
        console.error('Error checking existing settings:', checkError);
        throw new Error(checkError.message);
    }

    if (!existingData) {
        console.log('No existing settings found, creating new record...');
        const { data: newData, error: insertError } = await supabase
            .from('app_settings')
            .insert({ ...updateData, id: 1 })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating settings:', insertError);
            throw new Error(insertError.message);
        }
        
        console.log('Settings created successfully:', newData);
        return newData as AppSettings;
    }

    // Update the existing record
    const { data, error } = await supabase
        .from('app_settings')
        .update(updateData)
        .eq('id', 1)
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error updating settings:', error);
        throw new Error(error.message);
    }

    if (!data) {
        console.error('No data returned from update operation');
        throw new Error('Update operation did not return any data');
    }
    
    console.log('Settings updated successfully:', data);
    return data as AppSettings;
};

// Custom hook to manage app settings state
export const useAppSettings = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: settings, isLoading, isError, error } = useQuery<AppSettings>({
        queryKey: ['appSettings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 3,
        retryDelay: 1000,
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
            console.error('Error saving settings:', err);
            toast({
                title: 'Error Saving Settings',
                description: err.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        },
    });

    return {
        settings: settings || defaultSettings,
        isLoading,
        isError,
        error,
        updateSettings: mutation.mutate,
        isUpdating: mutation.isPending,
    };
};
