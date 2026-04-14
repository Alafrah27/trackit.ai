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

const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignUp() {
    const { signIn } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: '', email: '', password: '' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/verify-email');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
                            <MaterialCommunityIcons name="shield-account-variant-outline" size={48} color="white" />
                        </View>
                        <Text className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
                            Create Account
                        </Text>
                        <Text className="text-base text-white/80 text-center leading-6 px-2">
                            Get started with Trackit ai for a smarter life.
                        </Text>
                    </View>

                    <View className="bg-white  w-full rounded-t-[48px] p-8 justify-end py-12">
                        <View className="w-full">

                            <View className="w-full mb-2">
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <AnimatedInput
                                            iconName="account-outline"
                                            placeholder="Full Name"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.name?.message}
                                            autoCapitalize="words"
                                        />
                                    )}
                                />

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
                                            placeholder="Secure Password"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.password?.message}
                                            secureTextEntry
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
                                        <Text className="text-lg font-bold text-white tracking-wide">Create Account</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            <View className="mt-6 flex-row justify-center items-center">
                                <Text className="text-gray-500 text-base">Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/sign-in')} className="ml-1">
                                    <Text className="text-[#005bc1] text-base font-bold">Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}