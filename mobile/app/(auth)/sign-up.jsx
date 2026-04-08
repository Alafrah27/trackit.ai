import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';

export default function SignUp() {
    const { promptAsync } = useAuth();

    return (
        <SafeAreaView className='flex-1 bg-surface'>
            <View className="flex-1 px-6 justify-center">
                
                {/* Intro Section */}
                <View className="items-center mb-16">
                    <View className="bg-primary/10 p-6 rounded-full mb-6">
                        <MaterialCommunityIcons name="shield-account-variant-outline" size={80} color="#005bc1" />
                    </View>
                    <Text className="text-4xl font-extrabold text-on-surface text-center mb-3">
                        Trackit <Text className="text-primary">ai</Text>
                    </Text>
                    <Text className="text-lg text-on-surface-variant text-center leading-7 px-4">
                        Signing with Trackit ai for a smarter, more organized life.
                    </Text>
                </View>

                {/* Buttons Section */}
                <View className="w-full space-y-4">
                    {/* Google Button */}
                    <TouchableOpacity 
                        onPress={() => promptAsync()}
                        className="flex-row items-center justify-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200"
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                        <Text className="text-lg font-semibold text-gray-800 ml-4">
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    {/* Facebook Button */}
                    <TouchableOpacity 
                        onPress={() => {}}
                        className="flex-row items-center justify-center bg-[#1877F2] px-6 py-4 rounded-2xl shadow-sm mt-4"
                        activeOpacity={0.8}
                    >
                        <MaterialCommunityIcons name="facebook" size={24} color="#ffffff" />
                        <Text className="text-lg font-semibold text-white ml-4">
                            Continue with Facebook
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="mt-16 items-center">
                    <Text className="text-sm text-center text-on-surface-variant/60 px-6">
                        By continuing, you agree to our Terms of Service & Privacy Policy
                    </Text>
                </View>
                
            </View>
        </SafeAreaView>
    );
}