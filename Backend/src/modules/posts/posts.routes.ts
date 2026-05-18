import type { FastifyInstance } from "fastify";
import { protect } from "../../middleware/auth.middleware;
import { createPostHandler } from "./posts.controller";
import { postSchema } from "./posts.schema";
import { getPostsHandler } from "./posts.controller";

export default async function postsRoutes(app: FastifyInstance) {
  app.get("/posts", getPostsHandler);
  app.post("/posts", { preHandler: protect, schema: postSchema }, createPostHandler);
}
