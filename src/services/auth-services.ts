import { apiClient } from "@/hooks/use-api";
import { endpoints } from "./api";

 export const authService = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post(endpoints.auth.login, { email, password });
        return response.data;
    },
    logout: async () => {
        const response = await apiClient.post(endpoints.auth.logout);
        return response.data;
    },
    refreshToken: async () => {
        const response = await apiClient.post(endpoints.auth.refresh);
        return response.data;
    }
 }