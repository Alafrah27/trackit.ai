import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
    return (
        <>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="sign-up" options={{ animation: 'fade' }} />
                <Stack.Screen name="sign-in" options={{ animation: 'fade' }} />
                <Stack.Screen name="forgot-password" options={{ animation: 'fade' }} />
                <Stack.Screen name="verify-email" options={{ animation: 'fade' }} />
                <Stack.Screen name="update-phone" options={{ animation: 'fade' }} />
            </Stack>
        </>
    )
}