import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
    };
  }
}

export const protect = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return reply.code(401).send({
      message: "No token provided",
    });
  }

  const secret = process.env.JWT_SECRET!;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as unknown as {
      id: string;
    };

    request.user = {
      id: decoded.id,
    };
  } catch (error) {
    return reply.code(401).send({
      message: "Not authorized, token failed",
    });
  }
};
