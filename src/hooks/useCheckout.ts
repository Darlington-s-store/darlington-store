import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { useSMS } from "@/hooks/useSMS";

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
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { sendOrderConfirmationSMS, sendOwnerNotificationSMS } = useSMS();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      email: user?.email,
    },
  });

  const [paystackConfig, setPaystackConfig] = useState({
    reference: new Date().getTime().toString(),
    email: user?.email || "",
    amount: getTotalPrice() * 100, // in pesewas
    currency: 'GHS',
    publicKey: 'pk_live_595150e66d3a90b005ff10b96fbeeb4d59560058',
    channels: ['card', 'mobile_money', 'bank'],
  });

  const onPaymentSuccess = useCallback(async (reference: { reference: string }) => {
    console.log("Payment successful, verifying...", reference);
    setIsSubmitting(true);
    try {
      const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
        body: { reference: reference.reference }
      });

      if (verificationError || !verificationData.success || verificationData.status !== 'success') {
        console.error('Payment verification failed:', verificationData);
        throw new Error(verificationData.error || 'Payment verification failed');
      }
      console.log('Payment verification successful:', verificationData);


      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'completed', status: 'processing', payment_reference: reference.reference })
        .eq('id', currentOrder.id);

      if (updateError) throw updateError;
      console.log('Order status updated in database.');
      
      try {
        console.log('Sending SMS notifications...');
        await sendOrderConfirmationSMS(
          currentOrder.shipping_address.phone,
          currentOrder.order_number,
          currentOrder.total_amount,
          currentOrder.shipping_address.firstName
        );
        await sendOwnerNotificationSMS(
          currentOrder.order_number,
          currentOrder.total_amount,
          `${currentOrder.shipping_address.firstName} ${currentOrder.shipping_address.lastName}`,
          currentOrder.shipping_address.phone
        );
        console.log('SMS notifications sent.');
      } catch (smsError) {
        console.error("Failed to send SMS, but order is processed.", smsError);
      }

      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${currentOrder.order_number} has been placed.`,
      });
      navigate(`/orders`);

    } catch (error) {
      console.error('Payment verification/finalization error:', error);
      toast({
        title: "Payment Verification Failed",
        description: "There was an issue verifying your payment. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [currentOrder, clearCart, toast, navigate, sendOrderConfirmationSMS, sendOwnerNotificationSMS]);

  const onPaymentClose = useCallback(() => {
    console.log('Payment closed by user.');
    setIsSubmitting(false);
    toast({
        title: "Payment Cancelled",
        description: "You cancelled the payment process.",
        variant: "default"
    });
  }, [toast]);

  const initializePayment = usePaystackPayment(paystackConfig);
  
  const [shouldInitializePayment, setShouldInitializePayment] = useState(false);
  useEffect(() => {
    console.log('useEffect for payment initialization triggered. shouldInitializePayment:', shouldInitializePayment);
    if (shouldInitializePayment) {
      console.log('Initializing Paystack payment...');
      initializePayment({onSuccess: onPaymentSuccess, onClose: onPaymentClose});
      setShouldInitializePayment(false);
    }
  }, [shouldInitializePayment, initializePayment, onPaymentSuccess, onPaymentClose]);

  const onSubmit = async (data: CheckoutFormData) => {
    console.log('Checkout form submitted with data:', data);
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to complete your order", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Cart Empty", description: "Your cart is empty", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    console.log('isSubmitting set to true');

    try {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const shippingAddress = {
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        phone: data.phone,
        email: data.email,
      };

      console.log('Creating order in Supabase...');
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: getTotalPrice(),
          status: 'pending',
          payment_status: 'pending',
          payment_method: data.paymentMethod,
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          paystack_reference: data.paymentMethod === 'paystack' ? orderNumber : null,
        })
        .select()
        .single();

      if (orderError) throw orderError;
      console.log('Order created successfully:', order);
      setCurrentOrder(order);

      const orderItems = items.map(item => ({ order_id: order.id, product_id: item.id, product_name: item.name, quantity: item.quantity, price: item.price }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
      console.log('Order items inserted successfully.');

      if (data.paymentMethod === 'paystack') {
        console.log('Payment method is paystack. Preparing to initialize payment.');
        setPaystackConfig(prev => ({
          ...prev,
          reference: order.order_number,
          email: data.email,
          amount: order.total_amount * 100,
          currency: 'GHS',
          metadata: { order_id: order.id, user_id: user.id },
          channels: ['card', 'mobile_money', 'bank'],
        }));
        setShouldInitializePayment(true);
        console.log('shouldInitializePayment set to true');
      } else { // cash_on_delivery
        console.log('Payment method is cash_on_delivery.');
        try {
          await sendOrderConfirmationSMS(
            shippingAddress.phone,
            order.order_number,
            order.total_amount,
            shippingAddress.firstName
          );
          await sendOwnerNotificationSMS(
            order.order_number,
            order.total_amount,
            `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            shippingAddress.phone
          );
        } catch (smsError) {
          console.error("Failed to send SMS for cash on delivery", smsError);
        }

        clearCart();
        toast({ title: "Order Placed Successfully!", description: `Your order ${orderNumber} has been placed.` });
        navigate(`/orders`);
        setIsSubmitting(false);
        console.log('Cash on delivery order processed.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ title: "Checkout Failed", description: "There was an error processing your order. Please try again.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return {
    items,
    getTotalPrice,
    navigate,
    isSubmitting,
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
