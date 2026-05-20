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

export async function getPosts(request: FastifyRequest) {
  const query = `
    SELECT p.id, p.user_id, u.first_name, u.last_name, u.email as author_email,
           p.category, p.title, p.description, p.help_type, p.created_at, p.updated_at
    FROM post p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;

  const result = await request.server.pg.query(query);
  return result.rows;
}
