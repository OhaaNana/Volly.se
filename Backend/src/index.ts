import fastify from "fastify";
<<<<<<< HEAD
import Setup from "./Config";
=======
import Setup from "./config/index";
>>>>>>> f7cc2f3f185fd2309056d060b458b4ef370a1592
import setupErrorHandlers from "./shared/error/errorHanders";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/auth/auth.user.routes";
import chatRoutes from "./modules/chat/chat.routes";

async function start() {
  const app = fastify({ logger: true });

  await Setup(app);

  // Temporär debug-hook
  app.addHook("onRequest", (request, _reply, done) => {
    console.log(`>> ${request.method} ${request.url}`);
    done();
  });

  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(chatRoutes, { prefix: "/api/chat" });
  setupErrorHandlers(app);

  await app.listen({ port: 3001, host: "0.0.0.0" });
}

start();
