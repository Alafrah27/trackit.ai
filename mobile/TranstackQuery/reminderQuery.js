import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, date }) => {
      const { data } = await Instance.put(`/v1/reminder/update/${id}`, { date });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reminders"]);
    },
  });
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await Instance.delete(`/v1/reminder/delete/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reminders"]);
    },
  });
};
