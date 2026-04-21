import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
    const { t } = useTranslation();

    return (
        <>
            <StatusBar style="dark" />
            <Tabs screenOptions={{
                tabBarActiveTintColor: '#005bc1',
                tabBarInactiveTintColor: '#888888',
                tabBarStyle: {
                    backgroundColor: '#f0f0f0',
                    borderTopWidth: 0,
                    elevation: 5,
                    paddingBottom: 40,
                    paddingTop: 2,
                    height: 110,
                },
                tabBarLabelStyle: { fontSize: 10, fontWeight: 'semibold' }
            }} >
                <Tabs.Screen name="home" options={{
                    headerShown: false,
                    title: t('tabs.home'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }} />
                <Tabs.Screen name="expense" options={{
                    headerShown: false,
                    title: t('tabs.expense'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="card" size={size} color={color} />
                    ),
                }} />
                <Tabs.Screen name="reminder" options={{
                    headerShown: false,
                    title: t('tabs.reminder'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }} />
                <Tabs.Screen name="insights" options={{
                    headerShown: false,
                    title: t('tabs.insights'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="pie-chart" size={size} color={color} />
                    ),
                }} />
            </Tabs>
        </>
    );
}

