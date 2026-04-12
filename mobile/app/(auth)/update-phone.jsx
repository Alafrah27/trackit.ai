import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    const insets = useSafeAreaInsets();
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
            // Log full string sent to backend
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
                <View className="flex-1 justify-center mt-12 pb-10">
                    <View className="items-center mb-8">
                         <View className="bg-[#005bc1]/10 p-4 rounded-2xl mb-4 border border-[#005bc1]/5">
                            <MaterialCommunityIcons name="phone-outline" size={48} color="#005bc1" />
                        </View>
                        <Text className="text-3xl font-extrabold text-gray-900 text-center mb-2 tracking-tight">
                            Update Phone
                        </Text>
                        <Text className="text-base text-gray-500 text-center leading-6 px-2">
                            Enter your new phone number to keep your account secure.
                        </Text>
                    </View>

                    <View className="w-full mb-4">
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
                </View>

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
                            <Text className="text-lg font-bold text-white tracking-wide">Save Number</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
