import { Application, Router } from "./deps.ts";
import { load } from "./deps.ts";
import { OpenAIProxy } from "./openai_proxy.ts";

// Load environment variables
await load({ export: true });

const app = new Application();
const router = new Router();
const PORT = parseInt(Deno.env.get("PORT") || "8000");

// Create OpenAI proxy instance
const openaiProxy = new OpenAIProxy(Deno.env.get("OPENAI_API_KEY") || "");

// Add CORS middleware
app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200;
    return;
  }

  await next();
});

// Define routes
router.post("/api/openai/:endpoint*", async (ctx) => {
  try {
    const endpoint = ctx.params.endpoint + (ctx.params[0] || "");
    const requestBody = await ctx.request.body().value;

    const result = await openaiProxy.forward(endpoint, requestBody);
    ctx.response.status = 200;
    ctx.response.body = result;
  } catch (error) {
    console.error("Error in OpenAI proxy:", error);
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      error: true,
      message: error.message || "Internal server error",
    };
  }
});

// Health check endpoint
router.get("/health", (ctx) => {
  ctx.response.body = { status: "ok" };
});

// Apply router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
