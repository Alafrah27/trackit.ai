import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const Navbar = () => {
    return (
        <View className="flex-row items-center justify-between py-4 bg-surface">
            {/* Left side: Avatar and Greeting */}
            <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/30">
                    <Image
                        source={{ uri: 'https://avatar.iran.liara.run/public/job/operator/male' }}
                        className="w-full h-full"
                    />
                </View>
                <View className="ml-3">
                    <Text className="text-on-surface-variant text-xs font-medium">Good Morning,</Text>
                    <Text className="text-on-surface text-lg font-bold">الجائب</Text>
                </View>
            </View>

            {/* Right side: Action Icons */}
            <View className="flex-row items-center gap-2">
                <TouchableOpacity className="w-10 h-10 items-center justify-center bg-surface-container-high rounded-full relative">
                    <Ionicons name="notifications-outline" size={22} color="#2d3435" />
                    <View className="absolute top-2.5 right-3 w-2 h-2 bg-error rounded-full border border-surface" />
                </TouchableOpacity>

                <TouchableOpacity className="w-10 h-10 items-center justify-center bg-surface-container-high rounded-full">
                   <Ionicons name="chatbubble-ellipses-outline" size={24} color="#2d3435" />
                </TouchableOpacity>

                <TouchableOpacity className="w-10 h-10 items-center justify-center bg-surface-container-high rounded-full">
                    <Ionicons name="settings-outline" size={22} color="#2d3435" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Navbar
