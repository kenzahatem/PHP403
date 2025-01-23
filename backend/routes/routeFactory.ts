// backend/routes/routeFactory.ts
import { RouterMiddleware } from "https://deno.land/x/oak@v12.5.0/mod.ts";

interface SingleParamConfig {
  paramName: string;
  fetchFn: (paramValue: string) => Promise<any>;
  notFoundLabel: string;
}

export function createSingleParamGetRouteHandler(
  config: SingleParamConfig,
): RouterMiddleware<string> {
  const { paramName, fetchFn, notFoundLabel } = config;

  const middleware: RouterMiddleware<string> = async (context) => {
    const start = performance.now();

    const paramValue = context.params[paramName];
    if (!paramValue) {
      context.response.status = 400;
      context.response.body = { error: `${paramName} parameter is missing` };
      return;
    }

    try {
      const result = await fetchFn(paramValue);
      if (!result || (Array.isArray(result) && result.length === 0)) {
        context.response.status = 404;
        context.response.body = { error: `No ${notFoundLabel} found.` };
      } else {
        context.response.body = result;
      }
    } catch (error) {
      console.error(error);
      context.response.status = 500;
      context.response.body = { error: `Error fetching ${notFoundLabel}` };
    } finally {
      const duration = performance.now() - start;
      console.log(
        `[${context.request.method}] ${context.request.url.pathname}: ${duration}ms`
      );
    }
  };

  return middleware;
}
