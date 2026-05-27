import crypto from "crypto";

export default async function turnRoutes(fastify: any) {
  const TURN_SECRET = process.env.TURN_SECRET!;
  const TURN_HOST = process.env.TURN_HOST!;
  const TURN_PORT = process.env.TURN_PORT || "3478";

  fastify.get("/turn-credentials", async () => {
    const expiry = Math.floor(Date.now() / 1000) + 3600;
    const username = `${expiry}`;

    const credential = crypto
      .createHmac("sha1", TURN_SECRET)
      .update(username)
      .digest("base64");

    return {
      urls: [
        `stun:${TURN_HOST}:${TURN_PORT}`,
        `turn:${TURN_HOST}:${TURN_PORT}`,
      ],
      username,
      credential,
    };
  });
}
