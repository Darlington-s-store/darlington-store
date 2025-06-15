
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const CheckoutForm = () => {
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
    amount: getTotalPrice() * 100, // in kobo
    publicKey: 'pk_live_595150e66d3a90b005ff10b96fbeeb4d59560058',
    channels: ['card', 'mobile_money', 'bank'],
  });

  const onPaymentSuccess = async (reference: { reference: string }) => {
    console.log("Payment successful, verifying...", reference);
    setIsSubmitting(true);
    try {
      const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-payment', {
        body: { reference: reference.reference }
      });

      if (verificationError || !verificationData.success || verificationData.status !== 'success') {
        throw new Error(verificationData.error || 'Payment verification failed');
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_status: 'completed', status: 'processing', payment_reference: reference.reference })
        .eq('id', currentOrder.id);

      if (updateError) throw updateError;
      
      try {
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
  };

  const onPaymentClose = () => {
    console.log('Payment closed.');
    setIsSubmitting(false);
    toast({
        title: "Payment Cancelled",
        description: "You cancelled the payment process.",
        variant: "default"
    });
  };

  const initializePayment = usePaystackPayment(paystackConfig);
  
  const [shouldInitializePayment, setShouldInitializePayment] = useState(false);
  useEffect(() => {
    if (shouldInitializePayment) {
      initializePayment({onSuccess: onPaymentSuccess, onClose: onPaymentClose});
      setShouldInitializePayment(false);
    }
  }, [shouldInitializePayment, initializePayment, onPaymentSuccess, onPaymentClose]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to complete your order", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Cart Empty", description: "Your cart is empty", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

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
      setCurrentOrder(order);

      const orderItems = items.map(item => ({ order_id: order.id, product_id: item.id, product_name: item.name, quantity: item.quantity, price: item.price }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      if (data.paymentMethod === 'paystack') {
        setPaystackConfig(prev => ({
          ...prev,
          reference: order.order_number,
          email: data.email,
          amount: order.total_amount * 100,
          metadata: { order_id: order.id, user_id: user.id },
          channels: ['card', 'mobile_money', 'bank'],
        }));
        setShouldInitializePayment(true);
      } else { // cash_on_delivery
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
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ title: "Checkout Failed", description: "There was an error processing your order. Please try again.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName", { required: "First name is required" })}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName", { required: "Last name is required" })}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  {...register("phone", { required: "Phone number is required" })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...register("address", { required: "Address is required" })}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    {...register("city", { required: "City is required" })}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    {...register("state", { required: "State is required" })}
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  {...register("postalCode", { required: "Postal code is required" })}
                  className={errors.postalCode ? "border-red-500" : ""}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  {...register("paymentMethod", { required: "Payment method is required" })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Payment Method</option>
                  <option value="paystack">Paystack (Card/Bank/Mobile Money)</option>
                  <option value="cash_on_delivery">Cash on Delivery</option>
                </select>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-700 hover:bg-red-800"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₵{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-red-700">₵{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
