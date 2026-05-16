import type { FastifyInstance } from "fastify";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "./controllers/auth.user.controller";
import { protect } from "../../Middleware/auth.middleware";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: protect } as any, getUsers);
  app.get(
    "/:id",
    {
      preHandler: protect,
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
      },
    } as any,
    getUser
  );
  app.put(
    "/:id",
    {
      preHandler: protect,
      schema: {
        params: { type: "object", properties: { id: { type: "string" } } },
        body: { type: "object", properties: { email: { type: "string" } } },
      },
    } as any,
    updateUser
  );
  app.delete("/:id", { preHandler: protect } as any, deleteUser);
}
