import { useQuery } from "@tanstack/react-query";

import type {
  DashboardQueryParams,
  PostSearchParams,
} from "interfaces/dashboard";
import {
  getGeographicDistribution,
  getSentimentDistribution,
  getStats,
  getTopAuthors,
  getTopKeywords,
  getThreatTrend,
  searchPosts,
  translateToEnglish,
  getLanguages,
  getCountries,
  getSources,
  getActivityTrend,
  getTopSources,
  getMostViewed,
  getDateBounds,
  getIhraBreakdown,
  getTopicBreakdown,
  semanticSearch,
} from "services/dashboardService";

const STALE_TIME = 5 * 60 * 1000;

export const useLanguages = () =>
  useQuery({
    queryKey: ["dashboard", "languages"],
    queryFn: () => getLanguages(),
    staleTime: STALE_TIME,
  });

export const useCountries = () =>
  useQuery({
    queryKey: ["dashboard", "countries"],
    queryFn: () => getCountries(),
    staleTime: STALE_TIME,
  });

export const useSources = () =>
  useQuery({
    queryKey: ["dashboard", "sources"],
    queryFn: () => getSources(),
    staleTime: STALE_TIME,
  });

export const useDashboardStats = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "stats", params],
    queryFn: () => getStats(params),
    staleTime: STALE_TIME,
  });

export const useThreatTrend = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "threat-trend", params],
    queryFn: () => getThreatTrend(params),
    staleTime: STALE_TIME,
  });

export const useSentimentDistribution = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "sentiment-distribution", params],
    queryFn: () => getSentimentDistribution(params),
    staleTime: STALE_TIME,
  });

export const useTopKeywords = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "top-keywords", params],
    queryFn: () => getTopKeywords(params),
    staleTime: STALE_TIME,
  });

export const useGeographicDistribution = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "geographic-distribution", params],
    queryFn: () => getGeographicDistribution(params),
    staleTime: STALE_TIME,
  });

export const useTopAuthors = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "top-authors", params],
    queryFn: () => getTopAuthors(params),
    staleTime: STALE_TIME,
  });

export const useActivityTrend = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "activity-trend", params],
    queryFn: () => getActivityTrend(params),
    staleTime: STALE_TIME,
  });

export const useTopSources = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "top-sources", params],
    queryFn: () => getTopSources(params),
    staleTime: STALE_TIME,
  });

export const useMostViewed = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "most-viewed", params],
    queryFn: () => getMostViewed(params),
    staleTime: STALE_TIME,
  });

export const usePostSearch = (params: PostSearchParams) =>
  useQuery({
    queryKey: ["dashboard", "posts", params],
    queryFn: () => searchPosts(params),
    staleTime: 60 * 1000,
  });

export const useTranslation = (
  text: string,
  source: string | undefined,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ["dashboard", "translate", text, source],
    queryFn: () => translateToEnglish(text, source),
    enabled: enabled && !!text,
    staleTime: Infinity,
  });

export const useDateBounds = () =>
  useQuery({
    queryKey: ["dashboard", "date-bounds"],
    queryFn: () => getDateBounds(),
    staleTime: STALE_TIME,
  });

export const useIhraBreakdown = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "ihra-breakdown", params],
    queryFn: () => getIhraBreakdown(params),
    staleTime: STALE_TIME,
  });

export const useTopicBreakdown = (params?: DashboardQueryParams) =>
  useQuery({
    queryKey: ["dashboard", "topic-breakdown", params],
    queryFn: () => getTopicBreakdown(params),
    staleTime: STALE_TIME,
  });

export const useSemanticSearch = (query: string, page: number, pageSize: number, enabled: boolean) =>
  useQuery({
    queryKey: ["dashboard", "semantic-search", query, page, pageSize],
    queryFn: () => semanticSearch(query, page, pageSize),
    enabled: enabled && !!query,
    staleTime: 60 * 1000,
  });
