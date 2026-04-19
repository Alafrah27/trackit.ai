import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from 'expo-notifications';
import { useAuthStore } from "../store/authStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import MainLoadingPage from "../components/MainLoadingPage";
import { AuthProvider, useAuth } from "../context/authContext";
import Toast from "react-native-toast-message";
import "../global.css";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const Initialization = () => {
  const { user, isInitialized, initialize } = useAuthStore();
  const { updateExpoPushToken, expoPushToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isUpdatingPhone = segments[1] === 'update-phone';


    if (user) {
      if (!user.phone && !isUpdatingPhone) {
        router.replace('/(auth)/update-phone');
      } else if (user.phone && inAuthGroup) {
        router.replace('/(tabs)/home');
      }

    } else if (!user && !inAuthGroup) {
      router.replace('/');
    }
  }, [user, isInitialized, segments]);

  useEffect(() => {
    if (user && segments[0] === '(tabs)' && expoPushToken) {
      updateExpoPushToken();
    }
  }, [user, segments, expoPushToken])

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