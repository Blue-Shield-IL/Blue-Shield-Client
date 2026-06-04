import { createApiInstance } from "config/axiosInstance";

const axiosInstance = createApiInstance("keywords");

export const getTopics = async () =>
  (await axiosInstance.get<Topic[]>("/topics")).data;

export const getMyKeywords = async () =>
  (await axiosInstance.get<Keyword[]>("/me")).data;

export const submitOnboarding = async (topicIds: string[]) =>
  (await axiosInstance.post("/onboarding", { topics: topicIds })).data;

export interface Topic {
  id: string;
  name: string;
  icon: string | null;
  keywords: Keyword[];
}

export interface Keyword {
  id: string;
  word: string;
}
