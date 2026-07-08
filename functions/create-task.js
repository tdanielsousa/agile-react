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

  // Only allow POST requests for task creation
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    // Parse the incoming JSON body natively
    const { name, note, dueDate, projectId, userId } = await request.json();

    // Validation
    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Task name is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (!projectId || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required context keys (Project or User ID).",
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

    const query = `
      INSERT INTO tasks (project_id, user_id, name, status, note, due_date)
      VALUES (?, ?, ?, 'TODO', ?, ?);
    `;

    // Fallback empty text logic strings if user omits note or due date
    const finalNote = note?.trim() || null;
    const finalDueDate = dueDate || null;

    await client.execute({
      sql: query,
      args: [projectId, userId, name.trim(), finalNote, finalDueDate],
    });

    return new Response(
      JSON.stringify({ success: true, message: "Task created successfully!" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Erro na API create-task:", error);
    return new Response(
      JSON.stringify({
        error: "Erro ao criar tarefa no banco de dados.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
