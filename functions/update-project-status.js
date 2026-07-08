import { createClient } from "@libsql/client";

export async function onRequest(context) {
  const { request, env } = context;

  // Setup CORS Headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Only allow POST requests for state modifications
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    // Parse the incoming JSON body natively
    const body = await request.json();
    const { projectId, status } = body || {};

    // 1. Validation checks
    if (!projectId || !status) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: projectId and status.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Ensure the status strictly matches your schema rules safely
    const normalizedStatus = String(status).toUpperCase();
    if (normalizedStatus !== "ACTIVE" && normalizedStatus !== "OVER") {
      return new Response(
        JSON.stringify({
          error: 'Invalid status. Must be either "ACTIVE" or "OVER".',
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize the Turso client using Cloudflare's env context
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    // 2. Execute SQL update against your Turso DB
    await client.execute({
      sql: "UPDATE projects SET status = ? WHERE id = ?",
      args: [normalizedStatus, Number(projectId)],
    });

    // 3. Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Project status successfully updated to ${normalizedStatus}.`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Turso Database Error:", error);
    return new Response(
      JSON.stringify({
        error: "Erro ao atualizar o estado do projeto.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
