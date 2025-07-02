
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from 'sonner';

interface CheckoutData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  deliveryMethod: string;
  paymentMethod: string;
}

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrderNotification } = useNotifications();

  const processCheckout = async (checkoutData: CheckoutData) => {
    setIsProcessing(true);
    
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Calculate totals
      const subtotal = getTotalPrice();
      const deliveryFee = checkoutData.deliveryMethod === 'express' ? 20 : 0;
      const totalAmount = subtotal + deliveryFee;
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          total_amount: totalAmount,
          delivery_fee: deliveryFee,
          status: 'pending',
          payment_status: 'pending',
          payment_method: checkoutData.paymentMethod,
          delivery_method: checkoutData.deliveryMethod,
          shipping_address: {
            firstName: checkoutData.firstName,
            lastName: checkoutData.lastName,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: checkoutData.address,
            city: checkoutData.city,
            region: checkoutData.region
          },
          billing_address: {
            firstName: checkoutData.firstName,
            lastName: checkoutData.lastName,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: checkoutData.address,
            city: checkoutData.city,
            region: checkoutData.region
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
      await createOrderNotification(order.id, checkoutData.email, totalAmount);

      // Clear cart and navigate to success page
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders?success=true&order=${orderNumber}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCheckout,
    isProcessing
  };
};
