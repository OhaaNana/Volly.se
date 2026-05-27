import type { FastifyReply, FastifyRequest } from "fastify";
import { createPost, deletePost, getPostOwner, getPosts } from "./posts.repo";
import type { CreatePostInput } from "../../shared/types/posts.types";

type CreatePostBody = {
  title: string;
  description: string;
  help_type: string;
  category: string;
  tagg?: string;
};

export async function createPostHandler(
  request: FastifyRequest<{ Body: CreatePostBody }>,
  reply: FastifyReply
) {
  const { title, description, help_type, category, tagg } = request.body;
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
    tagg: tagg ?? "",
  };

  const post = await createPost(data, request);

  return reply.code(201).send(post);
}

export async function deletePostHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const userId = request.user?.id;
  if (!userId) {
    return reply.code(401).send({ message: "Not authenticated" });
  }

  const postId = Number(request.params.id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return reply.code(400).send({ message: "Invalid post id" });
  }

  try {
    const owner = await getPostOwner(request, postId);
    if (!owner) {
      return reply.code(404).send({ message: "Post not found" });
    }
    if (owner.user_id !== Number(userId)) {
      return reply
        .code(403)
        .send({ message: "You can only delete your own posts" });
    }

    const deleted = await deletePost(request, postId, Number(userId));
    if (!deleted) {
      return reply.code(404).send({ message: "Post not found" });
    }

    return reply.send({ message: "Post deleted", id: deleted.id });
  } catch (error) {
    console.error("deletePostHandler error:", error);
    return reply
      .code(500)
      .send({ message: "Failed to delete post", error: String(error) });
  }
}

export async function getPostsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authorEmail = (request.query as { author_email?: string })
      .author_email;
    const posts = await getPosts(request as FastifyRequest, authorEmail);
    return reply.send(posts);
  } catch (error) {
    // Log full error for debugging
    // eslint-disable-next-line no-console
    console.error("getPostsHandler error:", error);
    return reply
      .code(500)
      .send({ message: "Failed to fetch posts", error: String(error) });
  }
}
