import { useQuery } from "@tanstack/react-query";
import Instance from "../lib/axios";

export const useGetPlans = () => {
    return useQuery({
        queryKey: ["plans"],
        queryFn: async () => {
            const { data } = await Instance.get("/v1/plans");
            return data;
        },
    });
};
