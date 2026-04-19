import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from 'expo-notifications';
import { useAuthStore } from "../store/authStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import MainLoadingPage from "../components/MainLoadingPage";
import { AuthProvider } from "../context/authContext";
import Toast from "react-native-toast-message";
import "../global.css";

WebBrowser.maybeCompleteAuthSession();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const Initialization = () => {
  const { user, isInitialized, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    } else if (!user && !inAuthGroup) {
      router.replace('/');
    }
  }, [user, isInitialized, segments]);

  if (!isInitialized) return <MainLoadingPage />

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="setting" />
        <Stack.Screen name="record" />
        <Stack.Screen name="(auth)" />
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
      <Toast />
    </GestureHandlerRootView>
  );
}