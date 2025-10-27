import api from "./api";
import type { AdminAnalyticsDto, UserAnalyticsDto } from "../@api/models";

export const getAdminAnalytics = async (companyId: number): Promise<AdminAnalyticsDto> => {
  const response = await api.get(`/admin/analytics/summary`, {
    params: { companyId },
  });
  return response.data;
};

export const getUserAnalytics = async (companyId: number): Promise<UserAnalyticsDto> => {
  const response = await api.get(`/users/analytics`, {
    params: { companyId },
  });
  return response.data;
};
