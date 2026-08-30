import type { RouteKey } from "@astro-foundation/core";

/**
 * App-internal request intents. The destination route remains canonical route
 * data; this module owns only the stable flow vocabulary and intent signal.
 */
export const flowKeys = ["booking", "quote"] as const;

export type FlowKey = (typeof flowKeys)[number];

export interface FlowTarget {
  routeKey: RouteKey;
  intent: FlowKey;
}

const flowTargets: Record<FlowKey, FlowTarget> = {
  booking: { routeKey: "booking", intent: "booking" },
  quote: { routeKey: "booking", intent: "quote" },
};

export function isFlowKey(value: string): value is FlowKey {
  return flowKeys.includes(value as FlowKey);
}

export function getFlowTarget(flowKey: string): FlowTarget {
  if (!isFlowKey(flowKey)) {
    throw new Error(`Unknown flow key: ${flowKey}`);
  }
  return flowTargets[flowKey];
}
