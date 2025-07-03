
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  useEffect(() => {
    // Listen for auth events to create notifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session?.user) return;

        try {
          if (event === 'SIGNED_IN') {
            // Check if this is a new user registration by looking at created_at
            const userCreatedAt = new Date(session.user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - userCreatedAt.getTime();
            const isNewUser = timeDiff < 10000; // Less than 10 seconds ago = new registration

            if (isNewUser) {
              // Create registration notification
              await supabase.from('notifications').insert({
                type: 'user_registration',
                title: 'New User Registration',
                message: `User ${session.user.email} has registered`,
                user_id: session.user.id,
                metadata: {
                  email: session.user.email,
                  timestamp: new Date().toISOString()
                }
              });
            } else {
              // Create login notification
              await supabase.from('notifications').insert({
                type: 'user_login',
                title: 'User Login',
                message: `User ${session.user.email} has logged in`,
                user_id: session.user.id,
                metadata: {
                  email: session.user.email,
                  timestamp: new Date().toISOString()
                }
              });
            }
          }
        } catch (error) {
          console.error('Error creating notification:', error);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Function to create order notification
  const createOrderNotification = async (orderId: string, userEmail: string, totalAmount: number) => {
    try {
      await supabase.from('notifications').insert({
        type: 'order_placed',
        title: 'New Order Placed',
        message: `Order #${orderId.slice(-8)} placed by ${userEmail} for ₵${totalAmount}`,
        order_id: orderId,
        metadata: {
          order_id: orderId,
          user_email: userEmail,
          total_amount: totalAmount,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error creating order notification:', error);
    }
  };

  return { createOrderNotification };
};
