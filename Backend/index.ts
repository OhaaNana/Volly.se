import fastify, {type FastifyInstance } from "fastify";
import Config from "./Config/plugin";
import Setup from "./Config";


function start() {
  const app = fastify({ logger: true })
  Setup(app)
  
}

start()