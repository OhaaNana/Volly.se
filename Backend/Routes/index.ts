import type { FastifyInstance } from "fastify/types/instance";
import chat from "./chat"

export default async function routes(app: FastifyInstance) {
  chat(app)
}