import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AnimatedInput from '../../components/AnimatedInput';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export default function ForgotPassword() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: '' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSent(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <TouchableOpacity className="absolute top-10 left-5 z-10 w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100" onPress={() => router.back()}>
               <MaterialCommunityIcons name="arrow-left" size={24} color="#1f2937" />
            </TouchableOpacity>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-5 justify-center"
            >
                <View className="items-center mb-8">
                    <View className="bg-[#005bc1]/10 p-4 rounded-2xl mb-4 border border-[#005bc1]/5">
                        <MaterialCommunityIcons name={isSent ? "email-check-outline" : "form-textbox-password"} size={48} color="#005bc1" />
                    </View>
                    <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">
                        {isSent ? "Email Sent" : "Forgot pass?"}
                    </Text>
                    <Text className="text-base text-gray-500 text-center leading-6 px-2 mt-2">
                        {isSent 
                            ? "We've sent a secure password reset link to your email address." 
                            : "Enter your email and we'll send you a link to reset your password."}
                    </Text>
                </View>

                {!isSent && (
                    <>
                        <View className="w-full mb-4">
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
                        </View>

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
                                    <Text className="text-lg font-bold text-white tracking-wide">Send Reset Link</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {isSent && (
                    <View className="w-full">
                         <TouchableOpacity 
                            onPress={() => router.push('/sign-in')}
                            className="flex-row items-center justify-center bg-[#005bc1] px-6 py-4 rounded-xl"
                            activeOpacity={0.8}
                        >
                            <Text className="text-lg font-bold text-white tracking-wide">Back to Sign In</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
