/**
 * `growthbook-client` middleware
 */

import { GrowthBook, setPolyfills } from "@growthbook/growthbook";
import { StrapiExtended } from "../types";

export default (_: any, { strapi }: { strapi: StrapiExtended }) => {
  setPolyfills({
    // Required for Node 17 or earlier
    fetch: require("cross-fetch"),
    // Optional, can make feature rollouts faster
    EventSource: require("eventsource"),
  });

  let currentCtx: any = null;

  // Create a GrowthBook Context
  const growthbook = new GrowthBook({
    apiHost: process.env.GROWTHBOOK_APIHOST,
    clientKey: process.env.GROWTHBOOK_CLIENTKEY,
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
  return async (
    ctx: {
      state: { withGrowthBook: (theCtx: any, f: any) => void };
      req: { headers: { anonymousid: any } };
    },
    next: () => any
  ) => {
    ctx.state.withGrowthBook = (
      theCtx: any,
      f: (arg0: GrowthBook<Record<string, any>>) => void
    ) => {
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
