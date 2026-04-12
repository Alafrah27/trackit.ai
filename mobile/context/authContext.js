import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // This should eventually be connected to your custom backend
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // Example of custom backend call:
      // const response = await fetch('YOUR_API_URL/login', { ... });
      // const data = await response.json();
      
      // For now, simulate a successful generic login
      const mockUser = { id: "123", email, token: "custom_token" };
      await AsyncStorage.setItem("userInfo", JSON.stringify(mockUser));
      setUserInfo(mockUser);
    } catch (error) {
       console.log("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    try {
      setLoading(true);
      const dataInfo = await AsyncStorage.getItem("userInfo");
      if (dataInfo) {
        setUserInfo(JSON.parse(dataInfo));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        userInfo,
        loading,
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
