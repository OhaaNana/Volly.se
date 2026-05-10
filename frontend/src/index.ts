import { serve } from "bun";

const isProduction = process.env.NODE_ENV === "production";
const indexPath = new URL(isProduction ? "../dist/index.html" : "./index.html", import.meta.url);
const port = Number(process.env.PORT ?? 3000);

const server = serve({
  port,
  routes: {
    ...(isProduction
      ? {
          "/assets/:asset": req =>
            new Response(Bun.file(new URL(`../dist/assets/${req.params.asset}`, import.meta.url))),
        }
      : {}),

    // Serve index.html for all unmatched routes.
    "/*": () => new Response(Bun.file(indexPath)),

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
