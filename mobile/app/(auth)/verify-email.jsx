import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        <SafeAreaView className='flex-1 bg-white'>
            <View className="flex-1 bg-[#005bc1]">
                {/* Back Button */}
                <TouchableOpacity
                    className="absolute top-4 left-5 z-10 w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10"
                    onPress={() => router.back()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="items-center mb-10 mt-12 pb-4 flex-1">
                        <View className="bg-white/20 p-4 rounded-2xl mb-4 border border-white/10">
                            <MaterialCommunityIcons name="email-outline" size={48} color="white" />
                        </View>
                        <Text className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
                            Check your email
                        </Text>
                        <Text className="text-base text-white/80 text-center leading-6 px-4">
                            We've sent a 5-digit secure code to your email.
                        </Text>
                    </View>

                    <View className="bg-white  w-full rounded-t-[48px] p-8 justify-end py-12">
                        <View className="w-full">
                            <View className="w-full mb-8">
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
                                                    }}
                                                />
                                            </View>
                                            {errors.code && <Text className="w-full text-red-500 text-sm mt-3 font-semibold text-center">{errors.code.message}</Text>}
                                        </View>
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
                                        <Text className="text-lg font-bold text-white tracking-wide">Verify Account</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6 flex-row justify-center items-center">
                                <Text className="text-gray-500 text-sm">Didn't receive the code? </Text>
                                <TouchableOpacity className="ml-1">
                                    <Text className="text-[#005bc1] text-sm font-bold underline">Resend</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
