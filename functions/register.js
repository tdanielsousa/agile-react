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

  // Only allow POST requests for registration
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    // Parse the incoming JSON body natively
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Initialize the Turso client using Cloudflare's env context
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    // Insert the new user into the Turso database
    await client.execute({
      sql: "INSERT INTO users (username, password_hash) VALUES (?, ?);",
      args: [username, password]
    });

    return new Response(JSON.stringify({ success: true, message: "User created successfully!" }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error(error);
    
    // Check if the error is because the username already exists (UNIQUE constraint)
    if (error.message && error.message.includes("UNIQUE")) {
      return new Response(JSON.stringify({ error: "That username is already taken." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify({ error: "Database registration failed", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
