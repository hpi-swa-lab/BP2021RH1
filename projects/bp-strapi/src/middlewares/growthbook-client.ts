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
  });
  // Add your own logic here.
  return async (ctx, next) => {
    ctx.state.withGrowthBook = (theCtx, f) => {
      debugger;
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
