import type { FastifyInstance } from "fastify";
import pluginSetup from "./plugin";
import setupErrorHandlers from "./errorHanders";
import dbSetup from "./db";
import websocketSetup from "./wb";

export default async function Setup(app:FastifyInstance) {
  await pluginSetup(app)
  await dbSetup(app)
  await websocketSetup(app)
  
  setupErrorHandlers(app, )
  
  app.listen({ port: 3001, host: "0.0.0.0" }, (address) =>
     console.log(`Server is running at ${address}`),
   );
 }
}