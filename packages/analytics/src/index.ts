import { env } from "@boilerplate/env/server";

export interface AnalyticsEvent {
  event: string;
  distinctId: string;
  properties?: Record<string, unknown>;
}

export async function captureEvent(input: AnalyticsEvent) {
  if (env.ANALYTICS_PROVIDER === "disabled") return;

  const properties = { ...input.properties, distinct_id: input.distinctId };
  if (env.ANALYTICS_PROVIDER === "console") {
    console.info(JSON.stringify({ level: "info", source: "analytics", ...input, properties }));
    return;
  }
  if (!env.POSTHOG_API_KEY) throw new Error("POSTHOG_API_KEY is required for PostHog analytics");

  const response = await fetch(new URL("/capture/", env.POSTHOG_HOST), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ api_key: env.POSTHOG_API_KEY, event: input.event, properties }),
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`Analytics capture failed with status ${response.status}`);
}

export function safeCaptureEvent(input: AnalyticsEvent) {
  return captureEvent(input).catch((error) => {
    console.error(
      JSON.stringify({
        level: "error",
        event: "analytics.capture_failed",
        message: error instanceof Error ? error.message : "Unknown analytics error",
      }),
    );
  });
}
