import { createApiInstance } from "config/axiosInstance";
import type {
  ActivityTrendItem,
  DashboardQueryParams,
  DashboardStats,
  GeographicDistributionItem,
  IhraCategoryItem,
  MostViewedItem,
  PostSearchParams,
  PostSearchResult,
  SemanticSearchResult,
  SentimentDistributionItem,
  ThreatTrendItem,
  TopAuthorItem,
  TopKeywordItem,
  TopicBreakdownItem,
  TopSourceItem,
} from "interfaces/dashboard";

const dashboardApi = createApiInstance("dashboard");

/** Convert empty strings to undefined so Axios omits them from query params */
const orUndefined = (v: string | undefined) => (v ? v : undefined);

const buildParams = (params?: DashboardQueryParams) => ({
  startDate: orUndefined(params?.startDate),
  endDate: orUndefined(params?.endDate),
  keywords: params?.keywords || undefined,
});

export const getStats = async (params?: DashboardQueryParams) =>
  (await dashboardApi.get<DashboardStats>("/stats", { params: buildParams(params) })).data;

export const getThreatTrend = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<ThreatTrendItem[]>("/threat-trend", {
      params: { ...buildParams(params), interval: params?.interval },
    })
  ).data;

export const getSentimentDistribution = async (params?: DashboardQueryParams) =>
  (await dashboardApi.get<SentimentDistributionItem[]>("/sentiment", { params: buildParams(params) })).data;

export const getTopKeywords = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<TopKeywordItem[]>("/top-keywords", {
      params: { ...buildParams(params), limit: params?.limit },
    })
  ).data;

export const getGeographicDistribution = async (params?: DashboardQueryParams) =>
  (await dashboardApi.get<GeographicDistributionItem[]>("/geographic", { params: buildParams(params) })).data;

export const getTopAuthors = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<TopAuthorItem[]>("/top-authors", {
      params: { ...buildParams(params), limit: params?.limit },
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
  (await dashboardApi.get<{ code: string; name: string; count: number }[]>("/languages")).data;

export const getCountries = async () =>
  (await dashboardApi.get<{ country: string; count: number }[]>("/countries")).data;

export const getSources = async () =>
  (await dashboardApi.get<{ name: string; count: number }[]>("/sources")).data;

export const getActivityTrend = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<ActivityTrendItem[]>("/activity-trend", {
      params: { ...buildParams(params), interval: params?.interval },
    })
  ).data;

export const getTopSources = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<TopSourceItem[]>("/top-sources", {
      params: { ...buildParams(params), limit: params?.limit },
    })
  ).data;

export const getMostViewed = async (params?: DashboardQueryParams) =>
  (
    await dashboardApi.get<MostViewedItem[]>("/most-viewed", {
      params: { ...buildParams(params), limit: params?.limit },
    })
  ).data;

export const getDateBounds = async () =>
  (await dashboardApi.get<{ earliest: string; latest: string }>("/date-bounds")).data;

export const semanticSearch = async (query: string, page = 1, pageSize = 20) => {
  try {
    return (
      await dashboardApi.get<SemanticSearchResult>("/semantic-search", {
        params: { query, page, pageSize },
      })
    ).data;
  } catch {
    return { items: [], total: 0, page, pageSize, totalPages: 0 } as any;
  }
};

export const getIhraBreakdown = async (params?: DashboardQueryParams) =>
  (await dashboardApi.get<IhraCategoryItem[]>("/ihra-breakdown", { params: buildParams(params) })).data;

export const getTopicBreakdown = async (params?: DashboardQueryParams) =>
  (await dashboardApi.get<TopicBreakdownItem[]>("/topic-breakdown", { params: buildParams(params) })).data;
