import { createClient } from "@libsql/client";

export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");

  if (!projectId) {
    return new Response(
      JSON.stringify({ error: "Missing projectId parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    const projectResult = await client.execute({
      sql: "SELECT * FROM projects WHERE id = ? LIMIT 1",
      args: [projectId],
    });

    if (projectResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const projectRow = projectResult.rows[0];

    const tasksResult = await client.execute({
      sql: "SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at ASC",
      args: [projectId],
    });

    const projectData = {
      id: projectRow.id,
      name: projectRow.name,
      status: projectRow.status,
      created_at: projectRow.created_at,
      user_id: projectRow.user_id,
      tasks: tasksResult.rows,
    };

    return new Response(JSON.stringify(projectData), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Turso DB Error:", error);
    return new Response(JSON.stringify({ error: "Database fetch failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
