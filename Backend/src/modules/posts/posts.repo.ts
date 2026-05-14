import type { FastifyRequest } from "fastify";
import type { CreatePostInput, PostRow } from "../../shared/types/posts.types";


export async function createPost(
  data: CreatePostInput,
  request: FastifyRequest
): Promise<PostRow> {
  const query = `
    INSERT INTO post (user_id, category, title, description, help_type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, user_id, category, title, description, help_type, created_at, updated_at
  `;
  const result = await request.server.pg.query<PostRow>(query, [
    data.user_id,
    data.category,
    data.title,
    data.description,
    data.help_type,
  ]);
  return result.rows[0];
}
