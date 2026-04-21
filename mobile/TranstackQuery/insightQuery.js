import { useQuery } from "@tanstack/react-query";
import Instance from "../lib/axios";

/**
 * Fetches monthly expense insights (total, chart, categories, comparison).
 * @param {number} month - 1-indexed month number
 * @param {number} year  - Full year (e.g. 2026)
 */
export const useGetInsights = (month, year) => {
  return useQuery({
    queryKey: ["insights", month, year],
    queryFn: async () => {
      const { data } = await Instance.get("/v1/insights", {
        params: { month, year },
      });
      return data.insights;
    },
    // Keep previous data while fetching new month to avoid flicker
    placeholderData: (previousData) => previousData,
  });
};
