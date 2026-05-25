import { serve } from "bun";

const isProduction = process.env.NODE_ENV === "production";
const indexPath = new URL(
  isProduction ? "../dist/index.html" : "./index.html",
  import.meta.url
);
const port = Number(process.env.PORT ?? 3000);

const server = serve({
  port,
  hostname: "0.0.0.0",
  routes: {
    "/*": () => new Response(Bun.file(indexPath)),

    "/api/hello": {
      async GET() {
        return Response.json({ message: "Hello, world!", method: "GET" });
      },
      async PUT() {
        return Response.json({ message: "Hello, world!", method: "PUT" });
      },
    },

    "/api/hello/:name": (req) =>
      Response.json({ message: `Hello, ${req.params.name}!` }),

    "/assets/:asset": (req) => {
      if (!isProduction) return new Response("Not Found", { status: 404 });
      return new Response(
        Bun.file(new URL(`../dist/assets/${req.params.asset}`, import.meta.url))
      );
    },
  },

  development: !isProduction && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
