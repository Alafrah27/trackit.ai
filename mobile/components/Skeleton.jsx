import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence
} from 'react-native-reanimated';

const Skeleton = ({ width, height, radius = 8, style }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1, // Infinite repeat
            true // Reverse
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View 
            style={[
                { 
                    width: width || '100%', 
                    height: height || 20, 
                    borderRadius: radius,
                    backgroundColor: '#e2e8f0' // slate-200
                }, 
                animatedStyle, 
                style
            ]} 
        />
    );
};

export default Skeleton;
