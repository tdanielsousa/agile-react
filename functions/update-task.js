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
    const { taskId, name, status, note, dueDate } = body || {};

    if (!taskId || !name || !status) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: taskId, name, and status.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const normalizedStatus = String(status).toUpperCase();
    const allowedStatuses = ["TODO", "PROGRESS", "COMPLETED", "OVER"];
    if (!allowedStatuses.includes(normalizedStatus)) {
      return new Response(
        JSON.stringify({
          error: "Invalid status validation criteria failed.",
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
      sql: `
        UPDATE tasks 
        SET name = ?, status = ?, note = ?, due_date = ? 
        WHERE id = ?
      `,
      args: [name, normalizedStatus, note || null, dueDate || null, Number(taskId)],
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Task successfully updated.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Turso Task Update Database Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update the task inside Turso.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
