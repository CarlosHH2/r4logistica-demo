
import { serve } from "https://deno.fresh.dev/std@v1/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Configura los headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Crea el cliente de Supabase
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const orderId = url.pathname.split('/').pop();

    // GET /orders - Obtener todas las órdenes
    if (req.method === 'GET' && !orderId) {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*');

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /orders/:id - Obtener una orden específica
    if (req.method === 'GET' && orderId) {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /orders - Crear una nueva orden
    if (req.method === 'POST') {
      const orderData = await req.json();
      
      const { data, error } = await supabaseClient
        .from('orders')
        .insert([{
          ...orderData,
          is_manual: true,
          country: 'MX'
        }])
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // PUT /orders/:id - Actualizar una orden
    if (req.method === 'PUT' && orderId) {
      const updates = await req.json();
      
      const { data, error } = await supabaseClient
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /orders/:id - Eliminar una orden
    if (req.method === 'DELETE' && orderId) {
      const { error } = await supabaseClient
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }

    return new Response('Método no permitido', {
      headers: corsHeaders,
      status: 405,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
