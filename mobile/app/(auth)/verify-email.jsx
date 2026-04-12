import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import OTPTextView from 'react-native-otp-textinput';

const verifyEmailSchema = z.object({
  code: z.string().length(5, 'Code must be exactly 5 digits').regex(/^\d+$/, 'Code must contain only numbers'),
});

export default function VerifyEmail() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { code: '' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.replace('/sign-in');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className='flex-1 bg-white' style={{ paddingTop: insets.top }}>
             <TouchableOpacity 
                className="absolute left-5 z-10 w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100" 
                style={{ top: insets.top + 10 }}
                onPress={() => router.back()}
             >
               <MaterialCommunityIcons name="arrow-left" size={24} color="#1f2937" />
            </TouchableOpacity>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-5"
            >
                {/* Top Section: Centers itself using flex-1 */}
                <View className="flex-1 justify-center pb-20">
                    <View className="items-center mb-8">
                        <View className="bg-[#005bc1]/10 p-4 rounded-2xl mb-4 shadow-sm">
                            <MaterialCommunityIcons name="email-outline" size={48} color="#005bc1" />
                        </View>
                        <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">
                            Check your email
                        </Text>
                        <Text className="text-base text-gray-500 text-center leading-6 px-2">
                            We've sent a 5-digit secure code to your email.
                        </Text>
                    </View>

                    <View className="w-full mb-4">
                        <Controller
                            control={control}
                            name="code"
                            render={({ field: { onChange, value } }) => (
                                <View className="items-center">
                                    <View className="w-full flex-row items-center justify-between">
                                        <OTPTextView
                                            handleTextChange={onChange}
                                            inputCount={5}
                                            keyboardType="numeric"
                                            tintColor={errors.code ? "#ef4444" : "#005bc1"}
                                            offTintColor={errors.code ? "#fca5a5" : "#e5e7eb"}
                                            containerStyle={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}
                                            textInputStyle={{
                                                borderWidth: 1.5,
                                                borderBottomWidth: 1.5,
                                                borderRadius: 12,
                                                width: 55,
                                                height: 52,
                                                marginHorizontal: 0,
                                                backgroundColor: '#F9FAFB',
                                                color: '#111827',
                                                fontSize: 22,
                                                fontWeight: '800',
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.04,
                                                shadowRadius: 2,
                                                elevation: 1,
                                            }}
                                        />
                                    </View>
                                    {errors.code && <Text className="w-full text-red-500 text-sm mt-3 font-semibold text-center">{errors.code.message}</Text>}
                                </View>
                            )}
                        />
                    </View>
                </View>

                {/* Bottom Section: Pinned to bottom, dynamically calculates bottom inset */}
                <View className="w-full" style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
                    <TouchableOpacity 
                        onPress={handleSubmit(onSubmit)}
                        disabled={loading}
                        className={`flex-row items-center justify-center px-6 py-4 rounded-xl shadow-md ${loading ? 'bg-[#005bc1]/70' : 'bg-[#005bc1]'}`}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" size="small" />
                        ) : (
                            <Text className="text-lg font-bold text-white tracking-wide">Verify Account</Text>
                        )}
                    </TouchableOpacity>

                    <View className="mt-6 flex-row justify-center items-center">
                        <Text className="text-gray-500 text-sm">Didn't receive the code? </Text>
                        <TouchableOpacity className="ml-1">
                            <Text className="text-[#005bc1] text-sm font-bold underline">Resend</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </KeyboardAvoidingView>
        </View>
    );
}
