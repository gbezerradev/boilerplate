"use client";

import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";

export function useFeatureFlags() {
  return useQuery(trpc.featureFlags.evaluated.queryOptions());
}

export function useFeatureFlag(key: string) {
  const flags = useFeatureFlags();
  return {
    enabled: flags.data?.[key] ?? false,
    isPending: flags.isPending,
    error: flags.error,
  };
}
