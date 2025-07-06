import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSMS } from '@/hooks/useSMS';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sendOrderConfirmationSMS, sendOwnerNotificationSMS } = useSMS();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setVerificationStatus('failed');
      return;
    }

    if (!user) {
      navigate('/auth');
      return;
    }

    verifyPayment();
  }, [reference, user]);

  const verifyPayment = async () => {
    try {
      console.log('Verifying payment for reference:', reference);

      // Complete the order after payment verification
      const { data, error } = await supabase.functions.invoke('complete-order', {
        body: { reference }
      });

      if (error) {
        console.error('Order completion failed:', error);
        setVerificationStatus('failed');
        toast.error('Payment verification failed');
        return;
      }

      if (data.success) {
        setVerificationStatus('success');
        setOrderDetails(data.order);
        toast.success('Payment successful! Order created.');

        // Send SMS notifications
        try {
          const shippingAddress = data.order.shipping_address;
          if (shippingAddress?.phone) {
            await sendOrderConfirmationSMS(
              shippingAddress.phone,
              data.order.order_number,
              data.order.total_amount,
              `${shippingAddress.firstName} ${shippingAddress.lastName}`
            );
          }

          await sendOwnerNotificationSMS(
            data.order.order_number,
            data.order.total_amount,
            `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            shippingAddress?.phone
          );
        } catch (smsError) {
          console.error('SMS sending failed:', smsError);
          // Don't fail the verification if SMS fails
        }

        // Redirect to orders page after 3 seconds
        setTimeout(() => {
          navigate(`/orders?success=true&order=${data.order.order_number}`);
        }, 3000);
      } else {
        setVerificationStatus('failed');
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('failed');
      toast.error('An error occurred during payment verification');
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Verifying Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Please wait while we verify your payment...</p>
            </CardContent>
          </Card>
        );

      case 'success':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                Payment Successful
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Your payment has been verified and your order has been created successfully!
              </p>
              {orderDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Order Number:</strong> {orderDetails.order_number}</p>
                  <p><strong>Total Amount:</strong> ₵{orderDetails.total_amount.toFixed(2)}</p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                You will be redirected to your orders page shortly...
              </p>
              <Button 
                onClick={() => navigate(`/orders?success=true&order=${orderDetails?.order_number}`)}
                className="w-full"
              >
                View Order Details
              </Button>
            </CardContent>
          </Card>
        );

      case 'failed':
        return (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                <XCircle className="h-6 w-6" />
                Payment Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                We couldn't verify your payment. Please try again or contact support.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Return Home
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-32 md:pt-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Payment Verification</h1>
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentVerify;