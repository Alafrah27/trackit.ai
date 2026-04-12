import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AnimatedInput from '../../components/AnimatedInput';

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignIn() {
    const { signIn, loading } = useAuth();
    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = (data) => {
        signIn(data.email, data.password);
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-5 justify-center"
            >
                <View className="items-center mb-6 mt-4">
                    <View className="bg-[#005bc1]/10 p-4 rounded-2xl mb-4 border border-[#005bc1]/5">
                        <MaterialCommunityIcons name="face-man-profile" size={48} color="#005bc1" />
                    </View>
                    <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">
                        Welcome Back
                    </Text>
                    <Text className="text-base text-gray-500 text-center leading-6 px-2">
                        Sign in to continue to Trackit ai
                    </Text>
                </View>

                <View className="w-full mb-1">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                             <AnimatedInput 
                                iconName="email-outline"
                                placeholder="Email Address"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.email?.message}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <AnimatedInput 
                                iconName="lock-outline"
                                placeholder="Password"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                error={errors.password?.message}
                                secureTextEntry
                            />
                        )}
                    />
                </View>

                <TouchableOpacity 
                    className="self-end mb-6 mt-1" 
                    onPress={() => router.push('/forgot-password')}
                >
                    <Text className="text-[#005bc1] font-bold text-sm">Recover Password?</Text>
                </TouchableOpacity>

                <View className="w-full">
                    <TouchableOpacity 
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                        className={`flex-row items-center justify-center px-6 py-4 rounded-xl ${loading ? 'bg-[#005bc1]/70' : 'bg-[#005bc1]'}`}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-lg font-bold text-white tracking-wide">Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-6 flex-row justify-center items-center">
                    <Text className="text-gray-500 text-base">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/sign-up')} className="ml-1">
                        <Text className="text-[#005bc1] text-base font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
                
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
