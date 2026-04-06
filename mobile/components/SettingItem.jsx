import React from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

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
                    <Switch 
                        value={value} 
                        onValueChange={onPress}
                        trackColor={{ false: "#e0e0e0", true: activeColor }}
                        thumbColor={value ? '#ffffff' : '#f4f3f4'}
                        ios_backgroundColor="#e0e0e0"
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
