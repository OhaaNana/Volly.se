import type { FastifyInstance } from "fastify";
import { protect } from "../../Middleware/auth.middleware";
import { createPostHandler } from "./posts.controller";
import { postSchema } from "./posts.schema";

export default async function postsRoutes(app: FastifyInstance) {
  app.post("/posts", { preHandler: protect, schema: postSchema }, createPostHandler);
}
