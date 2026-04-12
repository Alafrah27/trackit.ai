import React, { useState, useEffect } from 'react';
import { View, TextInput, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function AnimatedInput({ 
  iconName, 
  leftContent,
  placeholder, 
  value, 
  onChangeText, 
  onBlur: hookFormBlur,
  error, 
  secureTextEntry, 
  keyboardType,
  autoCapitalize,
  maxLength
}) {
    const [isFocused, setIsFocused] = useState(false);
    
    // Smooth scaling animation via reanimated
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isFocused) {
            scale.value = withSpring(1.02, { damping: 15, stiffness: 300 });
        } else {
            scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        setIsFocused(false);
        if (hookFormBlur) hookFormBlur();
    };

    return (
        <View className="mb-3">
            <Animated.View 
                style={animatedStyle}
                className={`flex-row items-center bg-[#F9FAFB] px-3 py-2 rounded-xl border-[1.5px] ${
                    error ? 'border-red-500 bg-red-50' : isFocused ? 'border-[#005bc1] bg-white' : 'border-gray-200'
                }`}
            >
                {leftContent ? (
                  leftContent
                ) : iconName ? (
                  <MaterialCommunityIcons 
                      name={iconName} 
                      size={20} 
                      color={isFocused ? "#005bc1" : "#9ca3af"} 
                      className="mr-3" 
                  />
                ) : null}
                <TextInput
                    className="flex-1 text-base text-gray-900 font-medium ml-2"
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChangeText={onChangeText}
                    value={value}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                />
            </Animated.View>
            {error && <Text className="text-red-500 text-sm mt-1 ml-2 font-semibold">{error}</Text>}
        </View>
    );
}
