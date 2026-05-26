import type { FastifyInstance } from "fastify";
import { protect } from "../../middleware/auth.middleware";
import {
  createPostHandler,
  deletePostHandler,
  getPostsHandler,
} from "./posts.controller";
import { postSchema } from "./posts.schema";

export default async function postsRoutes(app: FastifyInstance) {
  app.get("/posts", getPostsHandler);
  app.post(
    "/posts",
    { preHandler: protect, schema: postSchema },
    createPostHandler
  );
  app.delete("/posts/:id", { preHandler: protect }, deletePostHandler);
}
