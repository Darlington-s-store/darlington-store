
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useDelivery } from '@/hooks/useDelivery';
import { useNotifications } from '@/hooks/useNotifications';
import { useSMS } from '@/hooks/useSMS';
import { toast } from 'sonner';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: string;
}

export const useCheckout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice: cartTotalPrice, clearCart } = useCart();
  const { locations: deliveryLocations, isLoading: isLoadingLocations } = useDelivery();
  const { createOrderNotification } = useNotifications();
  const { sendOrderConfirmationSMS, sendOwnerNotificationSMS } = useSMS();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>();

  const watchedCity = watch('city');
  const selectedLocation = deliveryLocations?.find(loc => loc.city === watchedCity);
  const deliveryFee = selectedLocation?.fee || 0;

  // Update state/region when city changes
  React.useEffect(() => {
    if (selectedLocation) {
      setValue('state', selectedLocation.region);
    }
  }, [selectedLocation, setValue]);

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalPrice = () => {
    return getCartTotal() + deliveryFee;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    try {
      // Calculate totals
      const subtotal = getCartTotal();
      const totalAmount = subtotal + deliveryFee;

      if (data.paymentMethod === 'cash_on_delivery') {
        // Handle cash on delivery (original flow)
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Create order directly for COD
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user?.id || null,
            order_number: orderNumber,
            total_amount: totalAmount,
            delivery_fee: deliveryFee,
            status: 'pending',
            payment_status: 'pending',
            payment_method: data.paymentMethod,
            delivery_method: 'standard',
            shipping_address: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              address: data.address,
              city: data.city,
              state: data.state,
              postalCode: data.postalCode
            },
            billing_address: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              address: data.address,
              city: data.city,
              state: data.state,
              postalCode: data.postalCode
            }
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Create notification for new order
        await createOrderNotification(order.id, data.email, totalAmount);

        // Send SMS notifications
        try {
          if (data.phone) {
            await sendOrderConfirmationSMS(
              data.phone, 
              orderNumber, 
              totalAmount, 
              `${data.firstName} ${data.lastName}`
            );
          }

          await sendOwnerNotificationSMS(
            orderNumber,
            totalAmount,
            `${data.firstName} ${data.lastName}`,
            data.phone
          );
        } catch (smsError) {
          console.error('SMS sending failed:', smsError);
        }

        // Clear cart and navigate to success page
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders?success=true&order=${orderNumber}`);
        
      } else if (data.paymentMethod === 'paystack') {
        // Handle Paystack payment
        const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('create-payment', {
          body: {
            email: data.email,
            amount: totalAmount,
            orderData: {
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
              address: data.address,
              city: data.city,
              state: data.state,
              postalCode: data.postalCode,
              paymentMethod: data.paymentMethod,
              items: items,
              deliveryFee: deliveryFee
            }
          }
        });

        if (paymentError) {
          console.error('Payment initialization failed:', paymentError);
          toast.error('Failed to initialize payment. Please try again.');
          return;
        }

        if (paymentResponse.success) {
          // Clear cart before redirecting to payment
          clearCart();
          // Redirect to Paystack payment page
          window.location.href = paymentResponse.authorization_url;
        } else {
          toast.error('Failed to initialize payment. Please try again.');
        }
      } else {
        toast.error('Please select a valid payment method.');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    items,
    getCartTotal,
    getTotalPrice,
    navigate,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    onSubmit,
    deliveryLocations,
    isLoadingLocations,
    selectedLocation,
    deliveryFee,
    processCheckout: onSubmit,
    isProcessing: isSubmitting
  };
};
