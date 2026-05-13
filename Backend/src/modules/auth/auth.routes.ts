import type { FastifyInstance } from "fastify";
import {
  register,
  login,
  refreshToken,
} from "./controllers/auth.controller";

export default async function authRoutes(app: FastifyInstance) {
  // Auth routes
  app.post("/register", register);
  app.post("/login", login);
  app.post("/refresh", refreshToken);
}
