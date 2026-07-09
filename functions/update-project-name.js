import { createClient } from '@libsql/client';

export async function onRequestPost(context) {
  const { env } = context;

  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  try {
    const body = await context.request.json();
    const { projectId, newName } = body || {};

    if (!projectId || !newName || !newName.trim()) {
      return new Response(
        JSON.stringify({ error: 'Project ID and new name are required.' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await client.execute({
      sql: 'UPDATE projects SET name = ? WHERE id = ?',
      args: [newName.trim(), Number(projectId)],
    });

    if (result.rowsAffected === 0) {
      return new Response(
        JSON.stringify({ error: 'Project not found.' }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Project name updated successfully!' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Turso Database Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao atualizar o nome do projeto.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
