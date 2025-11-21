import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface NotificationPayload {
  title: string;
  description: string;
  color: string;
  image?: string;
  timestamp?: string;
}

function isValidHexColor(color: string): boolean {
  if (!color.startsWith('#')) return false;
  const hexPart = color.slice(1);
  return (hexPart.length === 3 || hexPart.length === 6) && /^[0-9A-Fa-f]+$/.test(hexPart);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const payload: NotificationPayload = await req.json();

    if (!payload.title || !payload.description || !payload.color) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, description, color' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (typeof payload.title !== 'string' || payload.title.trim() === '' ||
        typeof payload.description !== 'string' || payload.description.trim() === '' ||
        typeof payload.color !== 'string' || payload.color.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Title, description, and color must be non-empty strings' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const validImageTypes = ['good', 'bad', 'problem'];
    const finalImage = payload.image && validImageTypes.includes(payload.image) ? payload.image : 'good';
    const finalColor = isValidHexColor(payload.color) ? payload.color : '#333333';
    const finalTimestamp = payload.timestamp || new Date().toISOString();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { error } = await supabase
      .from('notifications')
      .insert({
        title: payload.title,
        description: payload.description,
        color: finalColor,
        image: finalImage,
        timestamp: finalTimestamp,
      });

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Database error', details: error.message }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});