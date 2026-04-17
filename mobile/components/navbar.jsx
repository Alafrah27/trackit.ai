import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

import { useAuthStore } from '../store/authStore'
import { useRouter, usePathname } from 'expo-router'

const Navbar = () => {
    const { user } = useAuthStore();
    const router = useRouter()
    const pathname = usePathname()
    
    // Determine if we are on the expense screen to invert colors
    const isExpenseRoute = pathname === '/expense' || pathname === '/(tabs)/expense'

    return (
        <View className="flex-row items-center justify-between py-4 ">
            {/* Left side: Avatar and Greeting */}
            <View className="flex-row items-center ">
                <View className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/30">
                    {user?.imageUrl ? (
                        <Image
                            source={{ uri: user.imageUrl }}
                            className="w-full h-full"
                        />
                    ) : (
                        <View className="w-full h-full bg-gray-300 items-center justify-center">
                            <Ionicons name="person" size={24} color="white" />
                        </View>
                    )}
                </View>
                <View className="ml-3">
                    <Text className={`text-xs font-medium ${isExpenseRoute ? 'text-white/80' : 'text-on-surface-variant'}`}>Hello,</Text>
                    <Text className={`text-lg font-bold ${isExpenseRoute ? 'text-white' : 'text-on-surface'}`}>
                        {user?.name || 'Guest'}
                    </Text>
                </View>
            </View>

            {/* Right side: Action Icons */}
            <View className="flex-row items-center gap-2">
                <TouchableOpacity className={`w-10 h-10 items-center justify-center rounded-full relative ${isExpenseRoute ? 'bg-white/10' : 'bg-surface-container-high'}`}>
                    <Ionicons name="notifications-outline" size={22} color={isExpenseRoute ? "white" : "#2d3435"} />
                    <View className="absolute top-2.5 right-3 w-2 h-2 bg-error rounded-full border border-surface" />
                </TouchableOpacity>

                <TouchableOpacity className={`w-10 h-10 items-center justify-center rounded-full ${isExpenseRoute ? 'bg-white/10' : 'bg-surface-container-high'}`}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={isExpenseRoute ? "white" : "#2d3435"} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/setting/setting")}
                    className={`w-10 h-10 items-center justify-center rounded-full ${isExpenseRoute ? 'bg-white/10' : 'bg-surface-container-high'}`}>
                    <Ionicons name="settings-outline" size={22} color={isExpenseRoute ? "white" : "#2d3435"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Navbar
