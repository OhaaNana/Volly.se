import { serve } from "bun";

const isProduction = process.env.NODE_ENV === "production";
const indexPath = new URL(
  isProduction ? "../dist/index.html" : "./index.html",
  import.meta.url
);
const port = Number(process.env.PORT ?? 3000);

const routes: Record<string, unknown> = {
  "/*": () => new Response(Bun.file(indexPath)),

  "/api/hello": {
    async GET() {
      return Response.json({
        message: "Hello, world!",
        method: "GET",
      });
    },
    async PUT() {
      return Response.json({
        message: "Hello, world!",
        method: "PUT",
      });
    },
  },

  "/api/hello/:name": async (req: Request & { params: { name: string } }) => {
    const name = req.params.name;
    return Response.json({
      message: `Hello, ${name}!`,
    });
  },
};

if (isProduction) {
  routes["/assets/:asset"] = (req: Request & { params: { asset: string } }) =>
    new Response(
      Bun.file(new URL(`../dist/assets/${req.params.asset}`, import.meta.url))
    );
}

const server = serve({
  port,
  hostname: "0.0.0.0",
  routes,

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
