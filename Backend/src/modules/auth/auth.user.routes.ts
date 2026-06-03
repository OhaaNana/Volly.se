import type { FastifyInstance } from "fastify";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  updateUserByEmail,
  completeOnboarding,
} from "./controllers/auth.user.controller";
import { protect } from "../../middleware/auth.middleware";

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
  app.get(
    "/by-email/:email",
    {
      preHandler: protect,
      schema: {
        params: { type: "object", properties: { email: { type: "string" } } },
      },
    } as any,
    getUserByEmail
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
  app.put(
    "/by-email/:email",
    {
      preHandler: protect,
      schema: {
        params: { type: "object", properties: { email: { type: "string" } } },
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            first_name: { type: "string" },
            last_name: { type: "string" },
            bio: { type: "string" },
          },
        },
      },
    } as any,
    updateUserByEmail
  );
  app.delete("/:id", { preHandler: protect } as any, deleteUser);
  app.patch(
    "/me/onboarding",
    { preHandler: protect } as any,
    completeOnboarding
  );
}
