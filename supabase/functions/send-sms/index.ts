
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSRequest {
  phone: string;
  message: string;
  type: 'welcome' | 'order_confirmation';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message, type }: SMSRequest = await req.json();
    
    console.log('SMS request received:', { phone, type, messageLength: message.length });
    
    const arkeselApiKey = Deno.env.get('ARKESEL_API_KEY');
    
    if (!arkeselApiKey) {
      console.error('ARKESEL_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'SMS service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Format phone number for Ghana (remove leading 0 and add country code)
    let formattedPhone = phone.replace(/\s+/g, ''); // Remove spaces
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '233' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('233')) {
      formattedPhone = '233' + formattedPhone;
    }

    console.log('Formatted phone number:', formattedPhone);

    // Send SMS via Arkesel API
    const arkeselResponse = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'api-key': arkeselApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: 'Darlington', // Your sender ID
        message: message,
        recipients: [formattedPhone],
        sandbox: false, // Set to true for testing
      }),
    });

    const arkeselData = await arkeselResponse.json();
    console.log('Arkesel response:', arkeselData);

    if (!arkeselResponse.ok) {
      console.error('Arkesel API error:', arkeselData);
      return new Response(
        JSON.stringify({ error: 'Failed to send SMS', details: arkeselData }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('SMS sent successfully:', arkeselData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'SMS sent successfully',
        arkeselResponse: arkeselData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending SMS:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
