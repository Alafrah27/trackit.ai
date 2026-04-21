import { useQuery } from "@tanstack/react-query";
import Instance from "../lib/axios";

export const useGetReminders = () => {
  return useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data } = await Instance.get("/v1/reminder/get-all-reminders");
      return data.reminders || [];
    },
  });
};
