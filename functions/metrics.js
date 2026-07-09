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
    const userId = userIdParam ? Number(userIdParam) : 1; 

    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    const projectsQuery = `
      SELECT COUNT(*) as activeProjects 
      FROM projects 
      WHERE user_id = ? AND status = 'ACTIVE';
    `;

    const tasksQuery = `
      SELECT 
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) as completedTasks,
        SUM(CASE WHEN t.status IN ('TODO', 'PROGRESS') THEN 1 ELSE 0 END) as pendingTasks,
        SUM(CASE WHEN t.status = 'OVER' THEN 1 ELSE 0 END) as overdueTasks
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.user_id = ? AND p.status = 'ACTIVE';
    `;

    const projectsResult = await client.execute({
      sql: projectsQuery,
      args: [userId],
    });
    const tasksResult = await client.execute({
      sql: tasksQuery,
      args: [userId],
    });

    const activeProjects = Number(projectsResult.rows[0]?.activeProjects) || 0;
    const completedTasks = Number(tasksResult.rows[0]?.completedTasks) || 0;
    const pendingTasks = Number(tasksResult.rows[0]?.pendingTasks) || 0;
    const overdueTasks = Number(tasksResult.rows[0]?.overdueTasks) || 0;

    return new Response(
      JSON.stringify({
        activeProjects,
        completedTasks,
        pendingTasks,
        overdueTasks,
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
        error: "Erro ao carregar as métricas.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
