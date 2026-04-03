import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function AuthLayout() {
    return (
        <>
            <StatusBar style="dark" />
            <Stack>
                <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                <Stack.Screen name="sign-up" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </>
    )
}