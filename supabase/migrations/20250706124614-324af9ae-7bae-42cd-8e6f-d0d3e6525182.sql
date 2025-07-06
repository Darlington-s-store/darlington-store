-- Fix notifications RLS policy to allow system-generated notifications
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

-- Allow admins to manage all notifications
CREATE POLICY "Admins can manage all notifications" ON public.notifications
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow system to create notifications (for order notifications, user registration, etc.)
CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Allow users to read their own notifications
CREATE POLICY "Users can read their own notifications" ON public.notifications
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);