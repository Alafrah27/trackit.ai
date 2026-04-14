import { create } from "zustand";
import { Alert } from "react-native";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  loading: false,

  Register: async () => {
    try {
      set({ loading: true });
      const res = await Instance.post("/v1/user/register", {
        name,
        email,
        password,
      });
      
      if(res.data.success){
        return true;
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      set({ loading: false });
    }
  },
  Login: async () => {
    try {
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      set({ loading: false });
    }
  },
  VerifyOTP: async () => {
    try {
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
