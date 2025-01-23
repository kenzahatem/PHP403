// backend/middlewares/responseTime.ts
import { Context } from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { runWithSession } from "../database/utils.ts";
import { createNode } from "../database/functions/create.ts";

async function saveResponseTimeMetric(endpoint: string, responseTime: number, numItems: number,) {
  const label = "Metric";
  const properties = {
    type: "response_time",
    endpoint,
    responseTime,
    numItems,
    timestamp: new Date().toISOString(),
  };

  // Use `runWithSession` to manage session and save the node
  await runWithSession(createNode, label, properties);
}

export async function responseTimeLogger(ctx: Context, next: Function) {
  const start = performance.now();
  await next(); // Wait for the route handler to finish processing

  const duration = performance.now() - start;

  let numItems = 0;
  if (Array.isArray(ctx.response.body)) {
    // Count items if the response body is an array
    numItems = ctx.response.body.length;
  } else if (ctx.response.body && typeof ctx.response.body === "object") {
    // If the response body is an object, assume it's a single result
    numItems = 1;
  }

  console.log(
    `[${ctx.request.method}] ${ctx.request.url} - ${duration}ms, ${numItems} items returned`
  );

  // Save the response time metric with item count
  await saveResponseTimeMetric(ctx.request.url.pathname, duration, numItems);
}