import { createApiInstance } from "config/axiosInstance";
import type {
  ActivityTrendItem,
  DashboardQueryParams,
  DashboardStats,
  GeographicDistributionItem,
  MostViewedItem,
  PostSearchParams,
  PostSearchResult,
  SentimentDistributionItem,
  ThreatTrendItem,
  TopAuthorItem,
  TopKeywordItem,
  TopSourceItem,
} from "interfaces/dashboard";

const dashboardApi = createApiInstance("dashboard");

/** Convert empty strings to undefined so Axios omits them from query params */
const orUndefined = (v: string | undefined) => (v ? v : undefined);

export const getStats = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<DashboardStats>("/stats", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
      },
    })
  ).data;

export const getThreatTrend = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<ThreatTrendItem[]>("/threat-trend", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
        interval: params?.interval,
      },
    })
  ).data;

export const getSentimentDistribution = async (
  params?: DashboardQueryParams,
) =>
  (
    await dashboardApi.get<SentimentDistributionItem[]>("/sentiment", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
      },
    })
  ).data;

export const getTopKeywords = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<TopKeywordItem[]>("/top-keywords", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
        limit: params?.limit,
      },
    })
  ).data;

export const getGeographicDistribution = async (
  params?: DashboardQueryParams,
) =>
  (
    await dashboardApi.get<GeographicDistributionItem[]>("/geographic", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
      },
    })
  ).data;

export const getTopAuthors = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<TopAuthorItem[]>("/top-authors", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
        limit: params?.limit,
      },
    })
  ).data;

export const searchPosts = async (params?: PostSearchParams) =>
  (
    await dashboardApi.get<PostSearchResult>("/posts", {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search || undefined,
        author: params?.author || undefined,
        keywords: params?.keywords || undefined,
        hashtags: params?.hashtags || undefined,
        platform: params?.platform || undefined,
        language: params?.language || undefined,
        country: params?.country || undefined,
        sentiment: params?.sentiment || undefined,
        minScore: params?.minScore,
        maxScore: params?.maxScore,
        sortBy: params?.sortBy,
        sortOrder: params?.sortOrder,
        startDate: params?.startDate || undefined,
        endDate: params?.endDate || undefined,
      },
    })
  ).data;

export const translateToEnglish = async (text: string, source?: string) =>
  (
    await dashboardApi.get<{ translatedText: string; detectedSource: string }>(
      "/translate",
      { params: { text, source } },
    )
  ).data;

export const getLanguages = async () =>
  (
    await dashboardApi.get<{ code: string; name: string; count: number }[]>(
      "/languages",
    )
  ).data;

export const getActivityTrend = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<ActivityTrendItem[]>("/activity-trend", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
        interval: params?.interval,
      },
    })
  ).data;

export const getTopSources = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<TopSourceItem[]>("/top-sources", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
        limit: params?.limit,
      },
    })
  ).data;

export const getMostViewed = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<MostViewedItem[]>("/most-viewed", {
      params: {
        startDate: orUndefined(params?.startDate),
        endDate: orUndefined(params?.endDate),
        limit: params?.limit,
      },
    })
  ).data;

export const getDateBounds = async () =>
  (await dashboardApi.get<{ earliest: string; latest: string }>("/date-bounds"))
    .data;
