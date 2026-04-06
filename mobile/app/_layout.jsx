import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/authContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const Initialization = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
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