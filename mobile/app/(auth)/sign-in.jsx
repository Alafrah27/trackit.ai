import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from "../../store/authStore";
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
    const { login, loading, _pendingEmail } = useAuthStore();
    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data) => {
        const res = await login(data.email, data.password);
        // Assuming your backend responds with 403 containing "verify" for unverified accounts
        if (!res.success && res.message?.toLowerCase().includes("verify")) {
             useAuthStore.setState({ _pendingEmail: data.email });
             router.push('/verify-email');
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className="flex-1 bg-[#005bc1]">
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="items-center mb-8 mt-6 flex-1">
                        <View className="bg-white/20 p-4 rounded-2xl mb-4 border border-white/10">
                            <MaterialCommunityIcons name="face-man-profile" size={48} color="white" />
                        </View>
                        <Text className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
                            Welcome Back
                        </Text>
                        <Text className="text-base text-white/80 text-center leading-6 px-2">
                            Sign in to continue to Trackit ai
                        </Text>
                    </View>

                    <View className="bg-white  w-full rounded-t-[48px] p-8 justify-end py-12">
                        <View className="w-full">
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
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
