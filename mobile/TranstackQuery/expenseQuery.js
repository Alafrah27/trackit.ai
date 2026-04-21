import { useQuery } from "@tanstack/react-query";
import Instance from "../lib/axios";

export const useGetExpenses = () => {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data } = await Instance.get("/v1/expenses/get-expenses");
      return data.expenses;
    },
  });
};

export const useGetTotalExpenses = () => {
  return useQuery({
    queryKey: ["total-expenses"],
    queryFn: async () => {
      const { data } = await Instance.get("/v1/expenses/get-total-expenses");
      return data.expenses[0]; // Aggregate returns an array
    },
  });
};
