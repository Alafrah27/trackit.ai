import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";
import Instance from "@/lib/axios";
import Toast from "react-native-toast-message";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [error, setError] = useState(null);
  console.log("expoPushToken", expoPushToken);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token", token);
        setExpoPushToken(token);
      })
      .catch((error) => {
        console.error("Push registration error:", error);
        setError(error);
      });
  }, []);
  const updateExpoPushToken = async () => {
    if (!expoPushToken) return;
    try {
      const res = await Instance.put("/v1/user/update-expo-push-token", {
        expoPushToken: expoPushToken,
      });
      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: "Notification permission granted",
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Failed to get notification permission",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        updateExpoPushToken,
        expoPushToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default { AuthProvider, useAuth };
