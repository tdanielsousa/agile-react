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
    const userId = url.searchParams.get("userId");

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
        p.id,
        p.name,
        p.created_at as createdAt,
        COUNT(t.id) as totalTasks,
        SUM(CASE WHEN t.status = 'TODO' THEN 1 ELSE 0 END) as todo,
        SUM(CASE WHEN t.status = 'PROGRESS' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN t.status = 'OVER' THEN 1 ELSE 0 END) as overdue,
        MAX(t.due_date) as expectedEnd 
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = ? AND p.status = 'ACTIVE'
      GROUP BY p.id;
    `;

    const result = await client.execute({ sql: query, args: [userId] });

    const projects = result.rows.map((row) => {
      const total = Number(row.totalTasks) || 0;

      const getPercentage = (count) => {
        if (total === 0) return 0;
        return Number(((Number(count) / total) * 100).toFixed(2));
      };

      return {
        id: row.id,
        name: row.name,
        totalTasks: total,
        todo: Number(row.todo) || 0,
        inProgress: Number(row.inProgress) || 0,
        completed: Number(row.completed) || 0,
        overdue: Number(row.overdue) || 0,
        todoPct: getPercentage(row.todo),
        inProgressPct: getPercentage(row.inProgress),
        completedPct: getPercentage(row.completed),
        overduePct: getPercentage(row.overdue),

        createdAt: (() => {
          if (!row.createdAt) return "N/A";
          const parts = row.createdAt.split(" ");
          if (parts.length !== 2) return row.createdAt;

          const [datePart, timePart] = parts;
          const [year, month, day] = datePart.split("-");
          const [hour, minute] = timePart.split(":");

          return `${hour}:${minute} - ${day}/${month}/${year}`;
        })(),
        expectedEnd: row.expectedEnd || "N/A",
      };
    });

    return new Response(JSON.stringify(projects), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Erro ao carregar projetos da base de dados.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
