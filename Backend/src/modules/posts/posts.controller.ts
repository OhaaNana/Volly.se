import type { FastifyReply, FastifyRequest } from "fastify";
import { createPost } from "./posts.repo";
import type { CreatePostInput } from "../../shared/types/posts.types";

type CreatePostBody = {
  title: string;
  description: string;
  help_type: string;
  category: string;
};

export async function createPostHandler(
  request: FastifyRequest<{ Body: CreatePostBody }>,
  reply: FastifyReply
) {
  const { title, description, help_type, category } = request.body;
  const userId = request.user?.id;

  if (!userId) {
    return reply.code(401).send({ message: "Not authenticated" });
  }

  const data: CreatePostInput = {
    user_id: Number(userId),
    category,
    title,
    description,
    help_type,
  };

  const post = await createPost(data, request);

  return reply.code(201).send(post);
}

export async function getPostsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { getPosts } = await import("./posts.repo");
    const posts = await getPosts(request as FastifyRequest);
    return reply.send(posts);
  } catch (error) {
    return reply.code(500).send({ message: "Failed to fetch posts" });
  }
}
