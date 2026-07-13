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
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const body = await request.json();
    const { projectId, status } = body || {};

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

    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    await client.execute({
      sql: "UPDATE projects SET status = ? WHERE id = ?",
      args: [normalizedStatus, Number(projectId)],
    });

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
        error: "Error updating the project.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
