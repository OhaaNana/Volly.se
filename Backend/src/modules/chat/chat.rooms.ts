import type { UserMeta } from "../../shared/types/chat.types";
import type { WebSocket } from "@fastify/websocket";

export const rooms = new Map<string, Set<WebSocket>>();
export const users = new Map<WebSocket, UserMeta>();
