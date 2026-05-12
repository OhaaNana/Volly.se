import type { WebSocket } from "@fastify/websocket";
import type { UserMeta } from "../Types";

export const rooms = new Map<string, Set<WebSocket>>();
export const users = new Map<WebSocket, UserMeta>();
