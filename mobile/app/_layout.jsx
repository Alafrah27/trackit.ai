import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/authContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, View } from "react-native";
WebBrowser.maybeCompleteAuthSession();
const Initialization = () => {
  const { userInfo, loading } = useAuth();
  if (loading) {
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


        {
          userInfo ? (
            <Stack.Screen name="(tabs)" />
          ) : (
            <Stack.Screen name="(auth)" />
          )
        }


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