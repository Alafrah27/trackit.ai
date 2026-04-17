import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'

const CustomSwitch = ({ value, onValueChange, activeColor }) => {
    const trackStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withSpring(value ? activeColor : '#e2e8f0', { damping: 20, stiffness: 150 })
        }
    });

    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: withSpring(value ? 24 : 0, { damping: 20, stiffness: 150 }) }]
        }
    });

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
            <Animated.View style={[trackStyle, { width: 52, height: 28, borderRadius: 14, padding: 2 }]}>
                <Animated.View style={[thumbStyle, { 
                    width: 24, 
                    height: 24, 
                    backgroundColor: '#ffffff', 
                    borderRadius: 12, 
                    shadowColor: '#000', 
                    shadowOpacity: 0.2, 
                    shadowOffset: { width: 0, height: 1 }, 
                    shadowRadius: 2, 
                    elevation: 3 
                }]} />
            </Animated.View>
        </TouchableOpacity>
    )
}

const SettingItem = ({ 
    icon, 
    title, 
    value, 
    type = 'chevron', 
    onPress, 
    textColor = 'text-on-surface',
    iconColor = '#2d3435',
    activeColor = '#005bc1'
}) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center justify-between py-4 border-b border-outline-variant/10"
            activeOpacity={0.6}
            disabled={type === 'toggle'} // Prevent double trigger if toggle is clicked
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 items-center justify-center bg-surface-container-high rounded-full mr-4">
                    <Ionicons name={icon} size={22} color={iconColor} />
                </View>
                <View>
                    <Text className={`text-lg font-semibold ${textColor}`}>{title}</Text>
                    {type === 'value' && value && (
                        <Text className="text-on-surface-variant text-sm mt-0.5">{value}</Text>
                    )}
                </View>
            </View>
            
            <View className="flex-row items-center">
                {type === 'toggle' ? (
                    <CustomSwitch 
                        value={value} 
                        onValueChange={onPress} 
                        activeColor={activeColor} 
                    />
                ) : (
                    <View className="flex-row items-center">
                        {type === 'value' && (
                            <Ionicons name="chevron-forward" size={20} color="#888" style={{ marginLeft: 4 }} />
                        )}
                        {type === 'chevron' && (
                            <Ionicons name="chevron-forward" size={20} color="#888" />
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default SettingItem
