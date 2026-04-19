import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token))
      .catch((error) => {
        setError(error);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ expoPushToken }}>
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
