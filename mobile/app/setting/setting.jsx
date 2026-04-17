import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'


// Custom Components
import SettingItem from '../../components/SettingItem'
import SelectionSheet from '../../components/SelectionSheet'
import { useSettingsStore } from '../../store/useSettingsStore'
import { useAuthStore } from '../../store/authStore'

const Setting = () => {
    const router = useRouter()
    const { user, logout } = useAuthStore()

    // Zustand Settings Store
    const {
        currency, setCurrency,
        notifications, setNotifications,
        darkMode, setDarkMode,
        smartReminders, setSmartReminders,
        language, setLanguage
    } = useSettingsStore()

    // Sheet State
    const [sheetVisible, setSheetVisible] = useState(false)
    const [activeSheet, setActiveSheet] = useState(null) // 'currency' | 'language'

    const openSheet = (type) => {
        setActiveSheet(type)
        setSheetVisible(true)
    }

    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleSignOut = async () => {
        setIsLoggingOut(true)
        try {
            await logout()
            // Router layout navigation will automatically handle redirecting the user to auth
        } finally {
            setIsLoggingOut(false)
        }
    }

    // Config for Selection Sheet
    const sheetConfig = {
        currency: {
            title: 'Base Currency',
            options: [
                { label: 'US Dollar ($)', value: 'USD' },
                { label: 'Euro (€)', value: 'EUR' },
                { label: 'British Pound (£)', value: 'GBP' },
                { label: 'Saudi Riyal (SAR)', value: 'SAR' },
                { label: 'UAE Dirham (AED)', value: 'AED' },
            ],
            selected: currency,
            onSelect: setCurrency
        },
        language: {
            title: 'App Language',
            options: [
                { label: 'English', value: 'English' },
                { label: 'Arabic (العربية)', value: 'Arabic' },
                { label: 'French', value: 'French' },
            ],
            selected: language,
            onSelect: setLanguage
        }
    }

    const currentConfig = activeSheet ? sheetConfig[activeSheet] : null

    return (
        <SafeAreaView className="flex-1 bg-surface">
            {/* Custom Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center bg-white shadow-sm rounded-full"
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="ml-4 text-2xl font-bold text-on-surface">Settings & Profile</Text>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Profile Hero Section */}
                <View className="mt-8 mb-10 items-center">
                    <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-[#005bc1] items-center justify-center">
                        {user?.imageUrl ? (
                            <Image source={{ uri: user.imageUrl }} className="w-full h-full" />
                        ) : (
                            <Text className="text-white text-5xl font-bold uppercase">
                                {user?.name ? user.name.charAt(0) : '?'}
                            </Text>
                        )}
                    </View>
                    <Text className="mt-4 text-2xl font-bold text-on-surface">
                        {user?.name || 'TrackIt User'}
                    </Text>
                    <Text className="text-on-surface-variant font-medium">
                        {user?.email || ''}
                    </Text>
                </View>

                {/* Account Settings */}
                <View className="mb-8">
                    <Text className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2 px-1">Account</Text>
                    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/5 px-4 pb-2">
                        <SettingItem 
                            icon="person-outline" 
                            title="Personal Information" 
                            onPress={() => {}} 
                        />
                        <SettingItem 
                            icon="shield-checkmark-outline" 
                            title="Security" 
                            onPress={() => {}} 
                        />
                    </View>
                </View>

                {/* App Preferences */}
                <View className="mb-8">
                    <Text className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2 px-1">Preferences</Text>
                    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/5 px-4 pb-2">
                        <SettingItem
                            icon="cash-outline"
                            title="Base Currency"
                            type="value"
                            value={currency}
                            onPress={() => openSheet('currency')}
                        />
                        <SettingItem
                            icon="language-outline"
                            title="Language"
                            type="value"
                            value={language}
                            onPress={() => openSheet('language')}
                        />
                        <SettingItem
                            icon="notifications-outline"
                            title="Notifications"
                            type="toggle"
                            value={notifications}
                            onPress={() => setNotifications(!notifications)}
                        />
                        <SettingItem
                            icon="moon-outline"
                            title="Dark Mode"
                            type="toggle"
                            value={darkMode}
                            onPress={() => setDarkMode(!darkMode)}
                        />
                    </View>
                </View>

                {/* Reminders & Automation */}
                <View className="mb-8">
                    <Text className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2 px-1">Engagement</Text>
                    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/5 px-4 pb-2">
                        <SettingItem
                            icon="alarm-outline"
                            title="Smart Reminders"
                            type="toggle"
                            value={smartReminders}
                            onPress={() => setSmartReminders(!smartReminders)}
                        />
                    </View>
                </View>

                <View className="mt-4">
                    <TouchableOpacity
                        onPress={handleSignOut}
                        disabled={isLoggingOut}
                        className={`flex-row items-center justify-center p-5 rounded-3xl border ${isLoggingOut ? 'bg-error-container/50 border-error/5 opacity-70' : 'bg-error-container border-error/10'}`}
                    >
                        {isLoggingOut ? (
                            <ActivityIndicator size="small" color="#dc3545" />
                        ) : (
                            <>
                                <Ionicons name="log-out-outline" size={24} color="#dc3545" />
                                <Text className="ml-2 text-error font-extrabold text-lg">Sign Out</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-10 items-center">
                    <Text className="text-on-surface-variant/40 text-xs font-medium">TrackIt AI v1.0.0</Text>
                </View>
            </ScrollView>

            {/* Selection Bottom Sheet */}
            <SelectionSheet
                isVisible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                title={currentConfig?.title || ''}
                options={currentConfig?.options || []}
                selectedValue={currentConfig?.selected}
                onSelect={currentConfig?.onSelect || (() => { })}
            />
        </SafeAreaView>
    )
}

export default Setting