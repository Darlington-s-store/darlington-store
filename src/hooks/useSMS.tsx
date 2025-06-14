
import { supabase } from "@/integrations/supabase/client";

interface SMSData {
  phone: string;
  message: string;
  type: 'welcome' | 'order_confirmation' | 'owner_notification';
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

  const sendOwnerNotificationSMS = async (orderNumber: string, amount: number, customerName: string, customerPhone?: string) => {
    const ownerPhone = '0200000000'; // Replace with actual owner phone number
    const customerInfo = customerPhone ? `${customerName} (${customerPhone})` : customerName;
    const message = `New order received at Darlington Store! Order #${orderNumber} from ${customerInfo}. Amount: ₵${amount.toFixed(2)}. Please check your dashboard for details. 🛒`;
    
    return sendSMS({
      phone: ownerPhone,
      message,
      type: 'owner_notification'
    });
  };

  return {
    sendSMS,
    sendWelcomeSMS,
    sendOrderConfirmationSMS,
    sendOwnerNotificationSMS
  };
};
