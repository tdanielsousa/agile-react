import { createClient } from '@libsql/client';

export async function onRequest(context) {
  const { request, env } = context;

  // Setup CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Only allow POST requests for creation
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    // Parse the incoming JSON body natively
    const { name, userId } = await request.json();

    // Validation
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Project name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User validation failed.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Initialize the Turso client using Cloudflare's env context
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    const query = `
      INSERT INTO projects (name, status, user_id)
      VALUES (?, 'ACTIVE', ?)
    `;

    await client.execute({
      sql: query,
      args: [name.trim(), userId]
    });

    return new Response(JSON.stringify({ message: 'Project created successfully!' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Erro ao criar o projeto na base de dados.', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}