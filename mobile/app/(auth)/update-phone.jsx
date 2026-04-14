import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AnimatedInput from '../../components/AnimatedInput';
import CountryPicker from 'react-native-country-picker-modal';

const phoneSchema = z.object({
  phone: z.string().min(7, 'Phone number must be at least 7 digits').regex(/^\d+$/, 'Only numbers allowed'),
});

export default function UpdatePhone() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Country Picker State
    const [showPicker, setShowPicker] = useState(false);
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('1');

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(phoneSchema),
        defaultValues: { phone: '' }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Updated Phone String:", `+${callingCode}${data.phone}`);
            router.back();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const onSelectCountry = (country) => {
        setCountryCode(country.cca2);
        if (country.callingCode && country.callingCode.length > 0) {
           setCallingCode(country.callingCode[0]);
        }
        setShowPicker(false);
    };

    const LabeledPrefix = () => (
        <TouchableOpacity 
            className="flex-row items-center mr-2 pr-2 border-r border-gray-200"
            onPress={() => setShowPicker(true)}
            activeOpacity={0.6}
        >
            <View className="pl-1" pointerEvents="none">
                <CountryPicker
                    withFilter
                    withFlag
                    withEmoji
                    countryCode={countryCode}
                    visible={showPicker}
                    onSelect={onSelectCountry}
                    onClose={() => setShowPicker(false)}
                    containerButtonStyle={{ padding: 0, margin: 0, minWidth: 24 }}
                />
            </View>
            <Text className="text-base text-gray-900 font-bold ml-1 mr-1">+{callingCode}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>
    );

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
                    <View className="items-center mb-8 mt-12">
                         <View className="bg-white/20 p-4 rounded-2xl mb-4 border border-white/10">
                            <MaterialCommunityIcons name="phone-outline" size={48} color="white" />
                        </View>
                        <Text className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">
                            Update Phone
                        </Text>
                        <Text className="text-base text-white/80 text-center leading-6 px-4">
                            Enter your new phone number to keep your account secure.
                        </Text>
                    </View>

                    <View className="bg-white flex-1 w-full rounded-t-[48px] p-8 justify-end pb-12">
                        <View className="w-full">
                            <View className="w-full mb-6">
                                <Controller
                                    control={control}
                                    name="phone"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <AnimatedInput 
                                            leftContent={<LabeledPrefix />}
                                            placeholder="Phone Number"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.phone?.message}
                                            keyboardType="phone-pad"
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
                                        <Text className="text-lg font-bold text-white tracking-wide">Save Number</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}
