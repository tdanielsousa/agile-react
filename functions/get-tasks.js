import { createClient } from "@libsql/client";

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");

  if (!projectId) {
    return new Response(JSON.stringify({ error: "Missing projectId" }), {
      status: 400,
    });
  }

  const db = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await db.execute({
      sql: "SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC",
      args: [projectId],
    });

    return new Response(JSON.stringify(result.rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
