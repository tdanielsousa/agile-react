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

  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get("userId");
    const userId = userIdParam ? Number(userIdParam) : null;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId parameter" }),
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

    const query = `
      SELECT 
        COUNT(t.id) as totalTasks,
        SUM(CASE WHEN t.status = 'TODO' THEN 1 ELSE 0 END) as todo,
        SUM(CASE WHEN t.status = 'PROGRESS' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN t.status = 'OVER' THEN 1 ELSE 0 END) as overdue
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.user_id = ? AND p.status = 'ACTIVE';
    `;

    const result = await client.execute({ sql: query, args: [userId] });
    const row = result.rows[0];

    const total = Number(row.totalTasks) || 0;
    const todo = Number(row.todo) || 0;
    const inProgress = Number(row.inProgress) || 0;
    const completed = Number(row.completed) || 0;
    const overdue = Number(row.overdue) || 0;

    const getPct = (count) =>
      total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0;

    return new Response(
      JSON.stringify({
        totalTasks: total,
        todo,
        inProgress,
        completed,
        overdue,
        todoPct: getPct(todo),
        inProgressPct: getPct(inProgress),
        completedPct: getPct(completed),
        overduePct: getPct(overdue),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Error loading pie chart metrics.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
