import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AnimatedInput from '../../components/AnimatedInput';

import { useAuthStore } from '../../store/authStore';

const ForgotPassword = () => {
    const { forgotPassword, resetPassword, loading, _pendingEmail } = useAuthStore();
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [isSent, setIsSent] = useState(false);

    const forgotPasswordSchema = z.object({
        email: z.string().min(1, t('auth.emailRequired')).email(t('auth.invalidEmail')),
    });

    const resetPasswordSchema = z.object({
        otp: z.string().length(5, t('auth.otpLength')),
        newPassword: z.string().min(6, t('auth.passwordMin')),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(isSent ? resetPasswordSchema : forgotPasswordSchema),
        defaultValues: { email: '', otp: '', newPassword: '' }
    });

    const onSubmitEmail = async (data) => {
        const res = await forgotPassword(data.email);
        if (res.success) {
            setIsSent(true);
        }
    };

    const onSubmitReset = async (data) => {
        const res = await resetPassword(_pendingEmail, data.otp, data.newPassword);
        if (res.success) {
            router.replace('/sign-in');
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className="flex-1 bg-[#005bc1]">
                {!isSent && (
                    <TouchableOpacity
                        className="absolute top-4 left-5 z-10 w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/10"
                        onPress={() => router.back()}
                    >
                        <MaterialCommunityIcons name={i18n.language === 'ar' ? "arrow-right" : "arrow-left"} size={24} color="white" />
                    </TouchableOpacity>
                )}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="items-center mb-8 mt-12 flex-1">
                        <View className="bg-white/20 p-4 rounded-2xl mb-4 border border-white/10">
                            <MaterialCommunityIcons name={isSent ? "email-check-outline" : "form-textbox-password"} size={48} color="white" />
                        </View>
                        <Text className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
                            {isSent ? t('auth.emailSent') : t('auth.forgotPass')}
                        </Text>
                        <Text className="text-base text-white/80 text-center leading-6 px-4 mt-2">
                            {isSent ? t('auth.emailSentSub') : t('auth.forgotPassSub')}
                        </Text>
                    </View>

                    <View className="bg-white  w-full rounded-t-[48px] p-8 justify-end py-12">
                        <View className="w-full">
                            {!isSent && (
                                <>
                                    <View className="w-full mb-6">
                                        <Controller
                                            control={control}
                                            name="email"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <AnimatedInput
                                                    iconName="email-outline"
                                                    placeholder={t('common.email')}
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
                                            onPress={handleSubmit(onSubmitEmail)}
                                            disabled={loading}
                                            className={`flex-row items-center justify-center px-6 py-4 rounded-xl ${loading ? 'bg-[#005bc1]/70' : 'bg-[#005bc1]'}`}
                                            activeOpacity={0.8}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#ffffff" />
                                            ) : (
                                                <Text className="text-lg font-bold text-white tracking-wide">
                                                    {t('auth.sendResetLink')}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            {isSent && (
                                <>
                                    <View className="w-full mb-6">
                                        <Controller
                                            control={control}
                                            name="otp"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <AnimatedInput
                                                    iconName="lock-reset"
                                                    placeholder={i18n.language === 'ar' ? 'أدخل رمز التحقق' : 'Enter verification code'}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    error={errors.otp?.message}
                                                    keyboardType="numeric"
                                                />
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="newPassword"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <AnimatedInput
                                                    iconName="lock-outline"
                                                    placeholder={i18n.language === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                                                    value={value}
                                                    onChangeText={onChange} 
                                                    onBlur={onBlur}
                                                    error={errors.newPassword?.message}
                                                    secureTextEntry
                                                />
                                            )}
                                        />
                                    </View>
                                    <View className="w-full">
                                        <TouchableOpacity
                                            onPress={handleSubmit(onSubmitReset)}
                                            disabled={loading}
                                            className={`flex-row items-center justify-center bg-[#005bc1] px-6 py-4 rounded-xl ${loading ? 'opacity-70' : ''}`}
                                            activeOpacity={0.8}
                                        >
                                            {loading ? (
                                                <ActivityIndicator color="#ffffff" />
                                            ) : (
                                                <Text className="text-lg font-bold text-white tracking-wide">
                                                    {t('auth.resetPassword')}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

export default ForgotPassword;
