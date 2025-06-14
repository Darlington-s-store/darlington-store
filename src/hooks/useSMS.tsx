
import { supabase } from "@/integrations/supabase/client";

interface SMSData {
  phone: string;
  message: string;
  type: 'welcome' | 'order_confirmation';
}

export const useSMS = () => {
  const sendSMS = async (data: SMSData) => {
    try {
      console.log('Sending SMS via edge function:', data);
      
      const { data: response, error } = await supabase.functions.invoke('send-sms', {
        body: data
      });

      if (error) {
        console.error('SMS error:', error);
        throw error;
      }

      console.log('SMS sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  };

  const sendWelcomeSMS = async (phone: string, firstName?: string) => {
    const name = firstName || 'Customer';
    const message = `Welcome to Darlington Store, ${name}! Thank you for creating your account. Start shopping now and enjoy great deals on our products. Happy shopping! 🛍️`;
    
    return sendSMS({
      phone,
      message,
      type: 'welcome'
    });
  };

  const sendOrderConfirmationSMS = async (phone: string, orderNumber: string, amount: number, customerName?: string) => {
    const name = customerName || 'Customer';
    const message = `Hi ${name}, your order #${orderNumber} has been confirmed! Total: ₵${amount.toFixed(2)}. We'll notify you when it's ready for delivery. Thank you for choosing Darlington Store! 📦`;
    
    return sendSMS({
      phone,
      message,
      type: 'order_confirmation'
    });
  };

  return {
    sendSMS,
    sendWelcomeSMS,
    sendOrderConfirmationSMS
  };
};
