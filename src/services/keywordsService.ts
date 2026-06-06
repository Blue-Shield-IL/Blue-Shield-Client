import { createApiInstance } from "config/axiosInstance";
import type { Topic, Keyword } from "interfaces/keywords";

const axiosInstance = createApiInstance("keywords");

export const getTopics = async () =>
  (await axiosInstance.get<Topic[]>("/topics")).data;

export const getMyKeywords = async () =>
  (await axiosInstance.get<Keyword[]>("/me")).data;

export const submitOnboarding = async (topicIds: string[]) =>
  (await axiosInstance.post("/onboarding", { topics: topicIds })).data;

