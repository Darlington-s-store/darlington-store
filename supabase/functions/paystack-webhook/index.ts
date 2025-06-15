
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('x-paystack-signature')
    const body = await req.text()
    console.log('Received Paystack webhook.');

    const secret = Deno.env.get('sk_live_019075696c0d1c62f3d822dccaf66b1eed7481f1')
    if (!secret) {
        console.error('Paystack secret key not found for webhook verification.');
        return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: corsHeaders })
    }
    console.log('Paystack secret for webhook loaded.');

    // Verify webhook signature
    const hash = createHmac('sha512', secret).update(body).digest('hex')
    if (hash !== signature) {
      console.warn('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400, headers: corsHeaders })
    }
    console.log('Webhook signature verified.');
    
    const event = JSON.parse(body)
    console.log('Webhook event:', event.event);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (event.event === 'charge.success') {
      const { reference } = event.data
      console.log(`Processing charge.success for reference: ${reference}`);
      
      // Update order status in database
      const { data, error } = await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          status: 'processing',
          payment_reference: reference,
        })
        .eq('paystack_reference', reference)
        .select()

      if (error) {
        console.error('Error updating order:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update order' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      console.log(`Order updated successfully for reference: ${reference}. Rows affected: ${data?.length || 0}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
