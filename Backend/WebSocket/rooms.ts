import type { UserMeta } from "Backend/Types";
import type { WebSocket } from "@fastify/websocket";

export const rooms = new Map<string, Set<WebSocket>>();
export const users = new Map<WebSocket, UserMeta>();
