/**
 * `growthbook-client` middleware
 */

import { GrowthBook, setPolyfills } from "@growthbook/growthbook";
import { Strapi } from "@strapi/strapi";

export default (_, { strapi }: { strapi: Strapi }) => {
  setPolyfills({
    // Required for Node 17 or earlier
    fetch: require("cross-fetch"),
    // Optional, can make feature rollouts faster
    EventSource: require("eventsource"),
  });

  let currentCtx = null;

  // Create a GrowthBook Context
  const growthbook = new GrowthBook({
    apiHost: "https://growthbook.harz-history.de/proxy",
    clientKey: "sdk-g7fN7JoMErl22b8e",
    enableDevMode: true,
    trackingCallback: (experiment, result) => {
      const response = currentCtx.koaContext.response;
      let growthbookHeader = response.get("x-growthbook");
      growthbookHeader ||= "[]";
      const growthbookEvents = JSON.parse(growthbookHeader);
      growthbookEvents.push({
        experimentId: experiment.key,
        variationId: "v" + String(result.variationId),
      });
      response.set("x-growthbook", JSON.stringify(growthbookEvents));
      response.append("Access-Control-Expose-Headers", "x-growthbook");
    },
  });
  return async (ctx, next) => {
    ctx.state.withGrowthBook = (theCtx, f) => {
      currentCtx = theCtx;
      f(growthbook);
    };
    // Wait for features to load (will be cached in-memory for future requests)
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      id: ctx.req.headers.anonymousid,
    });
    await growthbook.loadFeatures();
    await next();
  };
};
