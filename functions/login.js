import { createClient } from "@libsql/client";

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    const { username, password } = await request.json();

    const result = await client.execute({
      sql: "SELECT id, username FROM users WHERE username = ? AND password_hash = ? LIMIT 1;",
      args: [username, password],
    });

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return new Response(
        JSON.stringify({
          success: true,
          user: { id: user.id, name: user.username },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid username or password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Database authentication failed",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
