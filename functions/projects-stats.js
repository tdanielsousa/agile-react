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

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
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

    const projectsQuery = `
      SELECT COUNT(*) as totalProjects 
      FROM projects 
      WHERE user_id = ?;
    `;

    const tasksQuery = `
      SELECT 
        SUM(CASE WHEN status = 'TODO' THEN 1 ELSE 0 END) as todoTasks,
        SUM(CASE WHEN status = 'PROGRESS' THEN 1 ELSE 0 END) as progressTasks,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedTasks,
        SUM(CASE WHEN status = 'OVER' THEN 1 ELSE 0 END) as overdueTasks
      FROM tasks 
      WHERE user_id = ?;
    `;

    const [projectsResult, tasksResult] = await Promise.all([
      client.execute({ sql: projectsQuery, args: [userId] }),
      client.execute({ sql: tasksQuery, args: [userId] }),
    ]);

    const totalProjects = Number(projectsResult.rows[0]?.totalProjects) || 0;
    const todoTasks = Number(tasksResult.rows[0]?.todoTasks) || 0;
    const progressTasks = Number(tasksResult.rows[0]?.progressTasks) || 0;
    const completedTasks = Number(tasksResult.rows[0]?.completedTasks) || 0;
    const overdueTasks = Number(tasksResult.rows[0]?.overdueTasks) || 0;

    return new Response(
      JSON.stringify({
        totalProjects,
        todoTasks,
        progressTasks,
        completedTasks,
        overdueTasks,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Erro na API projects-stats:", error);
    return new Response(
      JSON.stringify({
        error: "Erro ao carregar as estatísticas dos projetos.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
