import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/authContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

WebBrowser.maybeCompleteAuthSession();

// Static user for testing as you requested.
const user = true;

const Initialization = () => {
  // If you want to use the REAL auth context later, swap to this:
  // const { userInfo, loading } = useAuth();
  // const user = userInfo;
  // const isLoading = loading;

  const isLoading = false;

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until routing is ready and loading is finished
    if (isLoading) return;

    // Check if the user is currently inside the (auth) group
    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // ✅ FIX: Because you named your tab 'home' instead of 'index', 
      // you must route exactly to '/(tabs)/home'
      router.replace('/(tabs)/home');
    } else if (!user && !inAuthGroup) {
      // Put this back to the absolute path for sign in!
      router.replace('/(auth)/index');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#005bc1" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* DO NOT conditionally render Stack.Screens! Expo Router registers screens via files.
            We leave them all here, and let the useEffect above handle redirects smoothly. */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="setting" />
        <Stack.Screen name="record" />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Initialization />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}