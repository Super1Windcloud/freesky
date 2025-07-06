import { serve } from "@hono/node-server";
import { createFederationInstance } from "~/packages/fedify/server";
import { configure, getConsoleSink } from "@logtape/logtape";

async function startInstanceServer() {
  await configure({
    sinks: { console: getConsoleSink() },
    filters: {},
    loggers: [{ category: "fedify", sinks: ["console"], lowestLevel: "info" }],
  });

  const fd = await createFederationInstance();

  serve({
    port: 8888,
    fetch(request) {
      return fd.fetch(request, {
        contextData: undefined,
      });
    },
  });
}

await startInstanceServer();
