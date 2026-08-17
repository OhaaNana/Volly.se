import { describe, it, expect, beforeAll } from "bun:test";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { protect } from "./auth.middleware";

const JWT_SECRET = "test_secret_for_auth_middleware";

type MockReply = {
  statusCode?: number;
  payload?: unknown;
  code: (status: number) => MockReply;
  send: (body: unknown) => MockReply;
};

function createReply(): MockReply {
  const reply: MockReply = {
    code(status) {
      reply.statusCode = status;
      return reply;
    },
    send(body) {
      reply.payload = body;
      return reply;
    },
  };
  return reply;
}

function createRequest(authorization?: string): FastifyRequest {
  return {
    headers: authorization ? { authorization } : {},
  } as unknown as FastifyRequest;
}

describe("protect middleware", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  it("returns 401 when no Authorization header is provided", async () => {
    const reply = createReply();
    await protect(createRequest(), reply as unknown as FastifyReply);

    expect(reply.statusCode).toBe(401);
    expect(reply.payload).toEqual({ message: "No token provided" });
  });

  it("returns 401 when the token is invalid", async () => {
    const reply = createReply();
    await protect(
      createRequest("Bearer not-a-real-token"),
      reply as unknown as FastifyReply
    );

    expect(reply.statusCode).toBe(401);
    expect(reply.payload).toEqual({ message: "Not authorized, token failed" });
  });

  it("sets request.user and does not reject with a valid token", async () => {
    const reply = createReply();
    const token = jwt.sign({ id: "user-123" }, JWT_SECRET);
    const request = createRequest(`Bearer ${token}`);

    await protect(request, reply as unknown as FastifyReply);

    expect(reply.statusCode).toBeUndefined();
    expect(request.user).toEqual({ id: "user-123" });
  });
});
