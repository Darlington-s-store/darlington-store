
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()
    console.log('Verifying payment for reference:', reference);
    
    if (!reference) {
      console.error('Payment reference is required in request body');
      return new Response(
        JSON.stringify({ error: 'Payment reference is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const paystackSecretKey = Deno.env.get('sk_live_019075696c0d1c62f3d822dccaf66b1eed7481f1');
    if (!paystackSecretKey) {
        console.error('Paystack secret key not found in environment variables.');
        return new Response(JSON.stringify({ error: 'Server configuration error: missing Paystack secret key' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log('Paystack secret key loaded.');

    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('Paystack verification API response status:', paystackResponse.status);

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok) {
      console.error('Paystack verification failed:', paystackData);
      return new Response(
        JSON.stringify({ error: 'Payment verification failed', details: paystackData }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    console.log('Payment verification successful for reference:', reference);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: paystackData.data,
        status: paystackData.data.status,
        amount: paystackData.data.amount,
        currency: paystackData.data.currency
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error verifying payment:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
