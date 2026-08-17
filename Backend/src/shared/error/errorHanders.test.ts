import { describe, it, expect } from "bun:test";
import Fastify from "fastify";
import setupErrorHandlers from "./errorHanders";

function buildApp() {
  const app = Fastify();

  app.get("/boom", async () => {
    const err = new Error("Teapot") as Error & { statusCode?: number };
    err.statusCode = 418;
    throw err;
  });

  app.get("/duplicate", async () => {
    const err = new Error("duplicate key") as Error & { code?: string };
    err.code = "23505";
    throw err;
  });

  setupErrorHandlers(app);
  return app;
}

describe("error handlers", () => {
  it("returns 404 for unknown routes", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/does-not-exist" });

    expect(res.statusCode).toBe(404);
    expect(res.json().error).toBe("Not Found");
  });

  it("maps a custom statusCode error (<500) to that status", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/boom" });

    expect(res.statusCode).toBe(418);
    expect(res.json().message).toBe("Teapot");
  });

  it("maps a Postgres unique-violation (23505) to 409 Conflict", async () => {
    const app = buildApp();
    const res = await app.inject({ method: "GET", url: "/duplicate" });

    expect(res.statusCode).toBe(409);
    expect(res.json()).toEqual({
      error: "Conflict",
      message: "This resource already exists",
    });
  });
});
