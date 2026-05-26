import fastify from "fastify";
import Setup from "./config";
import setupErrorHandlers from "./shared/error/errorHanders";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/auth/auth.user.routes";
import chatRoutes from "./modules/chat/chat.routes";
import postsRoutes from "./modules/posts/posts.routes";

async function start() {
  const app = fastify({ logger: true });

  await Setup(app);

  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(chatRoutes, { prefix: "/api/chat" });
  app.register(postsRoutes, { prefix: "/api" });
  setupErrorHandlers(app);

  await app.listen({ port: 3001, host: "0.0.0.0" });
}

start();
