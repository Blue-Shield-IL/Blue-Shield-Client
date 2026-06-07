import { createApiInstance } from "config/axiosInstance";
import type { Topic, Keyword } from "interfaces/keywords";

const keywordsApi = createApiInstance("keywords");
const topicsApi = createApiInstance("topics");

export const getTopics = async () => (await topicsApi.get<Topic[]>("/")).data;

export const getMyKeywords = async () =>
  (await keywordsApi.get<Keyword[]>("/me")).data;

export const submitOnboarding = async (topicIds: string[]) =>
  (await keywordsApi.post("/onboarding", { topics: topicIds })).data;
