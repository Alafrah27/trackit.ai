import { Stack, useRouter, useSegments } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { useEffect } from "react";
import { tokenCache } from "../utils/tokenCache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

import { useAuthStore } from "../store/useAuthStore";
import api from "../utils/api";

function InitialLayout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { user, isSyncing, setSyncing, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(tabs)";
    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn) {
      // Need to sync the user if not synced already
      if (!user && !isSyncing) {
        setSyncing(true);
        getToken()
          .then((token) => {
            return api.post(
              "/api/user/sync",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          })
          .then((res) => {
            if (res.data.success) {
              setUser(res.data.user);
            }
            setSyncing(false);
            // After successful sync, we can safely be in tabs
            if (!inTabsGroup) {
              router.replace("/(tabs)");
            }
          })
          .catch((err) => {
            console.error("Backend sync failed:", err);
            setSyncing(false);
            // Optionally sign out the user if the backend sync is critical
            // logout(); 
          });
      } else if (user && !inTabsGroup) {
        // User is synced and valid, go to tabs
        router.replace("/(tabs)");
      }
    } else {
      // Not signed in
      if (user) {
        logout(); // Clear the store if clerk signs out
      }
      if (!inAuthGroup) {
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isSignedIn, isLoaded, segments, user, isSyncing]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <StatusBar style="auto" />
      <InitialLayout />
    </ClerkProvider>
  );
}
