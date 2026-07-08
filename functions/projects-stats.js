import { createClient } from '@libsql/client';

export async function onRequest(context) {
  const { request, env } = context;

  // Setup CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    // Parse the query parameters from the URL
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');
    const userId = userIdParam ? Number(userIdParam) : null;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Initialize the Turso client using Cloudflare's env context
    const client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    });

    // Query 1: Count ALL projects regardless of status
    const projectsQuery = `
      SELECT COUNT(*) as totalProjects 
      FROM projects 
      WHERE user_id = ?;
    `;

    // Query 2: Aggregate task statuses directly from the tasks table for this user
    const tasksQuery = `
      SELECT 
        SUM(CASE WHEN status = 'TODO' THEN 1 ELSE 0 END) as todoTasks,
        SUM(CASE WHEN status = 'PROGRESS' THEN 1 ELSE 0 END) as progressTasks,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedTasks,
        SUM(CASE WHEN status = 'OVER' THEN 1 ELSE 0 END) as overdueTasks
      FROM tasks 
      WHERE user_id = ?;
    `;

    // Execute queries using Promise.all for faster, concurrent execution on the edge
    const [projectsResult, tasksResult] = await Promise.all([
      client.execute({ sql: projectsQuery, args: [userId] }),
      client.execute({ sql: tasksQuery, args: [userId] })
    ]);

    // Map rows safely back to Numbers
    const totalProjects = Number(projectsResult.rows[0]?.totalProjects) || 0;
    const todoTasks = Number(tasksResult.rows[0]?.todoTasks) || 0;
    const progressTasks = Number(tasksResult.rows[0]?.progressTasks) || 0;
    const completedTasks = Number(tasksResult.rows[0]?.completedTasks) || 0;
    const overdueTasks = Number(tasksResult.rows[0]?.overdueTasks) || 0;

    // Send structured data response
    return new Response(JSON.stringify({
      totalProjects,
      todoTasks,
      progressTasks,
      completedTasks,
      overdueTasks
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error("Erro na API projects-stats:", error);
    return new Response(JSON.stringify({ error: "Erro ao carregar as estatísticas dos projetos.", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
