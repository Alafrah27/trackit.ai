import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebseConfig";
import { Alert } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_CLIENT_ID,
  });

  const checkUser = async () => {
    try {
      setLoading(true);
      const userInfo = await AsyncStorage.getItem("userInfo");
      // validate expire token
      const isTokenExpired =
        new Date(userInfo?.stsTokenManager?.expirationTime) < new Date();
      const datainfo = isTokenExpired ? null : userInfo;
      // set user info
      if (datainfo) {
        setUserInfo(JSON.parse(datainfo));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  const syncUserWithBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000/api";
      
      const response = await axios.post(
        `${apiUrl}/v1/user/outh`,
        {
          email: firebaseUser.email,
          name: firebaseUser.displayName || "Trackit User",
          avatar: firebaseUser.photoURL || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Backend Sync Success:", response.data.message);
      return response.data;
    } catch (error) {
      console.error("Error syncing with backend:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    checkUser();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("userInfo", JSON.stringify(user));
        setUserInfo(user);
        
        // Sync user with our MongoDB backend
        await syncUserWithBackend(user);
      } else {
        console.log("User not found");
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        promptAsync,
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
