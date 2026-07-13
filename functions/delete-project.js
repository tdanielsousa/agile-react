import { createClient } from "@libsql/client";

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (request.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const body = await request.json();
    const { projectId } = body || {};

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: projectId." }),
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
      sql: "DELETE FROM tasks WHERE project_id = ?",
      args: [Number(projectId)],
    });

    const result = await client.execute({
      sql: "DELETE FROM projects WHERE id = ?",
      args: [Number(projectId)],
    });

    if (result.rowsAffected === 0) {
      return new Response(JSON.stringify({ error: "Project not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Project deleted successfully!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Turso Delete Error:", error);
    return new Response(
      JSON.stringify({
        error: "Error deleting the project.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
