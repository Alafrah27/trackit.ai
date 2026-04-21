import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ThemedSafeArea from '../../components/ThemedSafeArea'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Mic from '../../components/Mic'

const Reminder = () => {
    const { i18n } = useTranslation()
    return (
        <ThemedSafeArea>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-12 mt-10 px-2">
                    <Text className="text-4xl font-extrabold text-on-surface tracking-tighter mb-4">
                        {i18n.language === "ar" ? "لا تفوت أي شيء يهمك" : "Never Miss What Matters"}
                    </Text>
                    <Text className="text-on-surface-variant text-md font-semibold">
                        {
                            i18n.language === "ar" ? "تتبع التذكيرات والمكالمات المهمة والمهام في مكان واحد ذكي" :
                                "track reminders, schedules calls, and importants Tasks - all in one smart place"
                        }
                    </Text>
                </View>

                <View className="space-y-12">
                    {/* Today Group */}
                    <View>
                        <Text className="text-md font-extrabold text-on-surface-variant uppercase tracking-widest mb-6 px-2">
                            {i18n.language === "ar" ? "اليوم" : "Today"}
                        </Text>
                        <View className="space-y-3">
                            {/* Reminder Card 1 */}
                            <View className="bg-surface-container-lowest p-6 rounded-xl flex-row items-start gap-4 mb-4">
                                <View className="mt-1 w-10 h-10 rounded-full bg-primary-container items-center justify-center">
                                    <Ionicons name="card-outline" size={20} color="#005bc1" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="font-semibold text-on-surface text-lg">Monthly Rent Payment</Text>
                                        <View className="bg-primary-container/30 px-2 py-1 rounded-full">
                                            <Text className="text-xs font-bold text-primary uppercase">High</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center gap-3 mt-1">
                                        <View className="flex-row items-center gap-1">
                                            <Ionicons name="time-outline" size={14} color="#64748b" />
                                            <Text className="text-on-surface-variant text-sm">09:00 AM</Text>
                                        </View>
                                        <View className="w-1 h-1 rounded-full bg-outline-variant" />
                                        <Text className="text-on-surface-variant text-sm">$1,450.00</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Reminder Card 2 */}
                            <View className="bg-surface-container-lowest p-6 rounded-xl flex-row items-start gap-4 mb-4">
                                <View className="mt-1 w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
                                    <Ionicons name="restaurant-outline" size={20} color="#3b82f6" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="font-semibold text-on-surface text-lg">Lunch with Design Team</Text>
                                        <Ionicons name="ellipsis-horizontal" size={20} color="#64748b" />
                                    </View>
                                    <View className="flex-row items-center gap-3 mt-1">
                                        <View className="flex-row items-center gap-1">
                                            <Ionicons name="time-outline" size={14} color="#64748b" />
                                            <Text className="text-on-surface-variant text-sm">12:30 PM</Text>
                                        </View>
                                        <View className="w-1 h-1 rounded-full bg-outline-variant" />
                                        <Text className="text-on-surface-variant text-sm">Veranda Bistro</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Tomorrow Group */}
                    <View>
                        <Text className="text-md font-extrabold text-on-surface-variant uppercase tracking-widest mb-6 px-2">
                            {i18n.language === "ar" ? "غداً" : "Tomorrow"}
                        </Text>
                        <View className="space-y-3">
                            {/* Reminder Card 3 */}
                            <View className="bg-surface-container-low p-6 rounded-xl flex-row items-start gap-4 opacity-80 mb-4">
                                <View className="mt-1 w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                                    <Ionicons name="fitness-outline" size={20} color="#64748b" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="font-semibold text-on-surface text-lg">Morning Pilates Session</Text>
                                    </View>
                                    <View className="flex-row items-center gap-3 mt-1">
                                        <View className="flex-row items-center gap-1">
                                            <Ionicons name="calendar-outline" size={14} color="#64748b" />
                                            <Text className="text-on-surface-variant text-sm">Oct 24</Text>
                                        </View>
                                        <View className="w-1 h-1 rounded-full bg-outline-variant" />
                                        <Text className="text-on-surface-variant text-sm">07:00 AM</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Reminder Card 4 */}
                            <View className="bg-surface-container-low p-6 rounded-xl flex-row items-start gap-4 opacity-80 mb-4">
                                <View className="mt-1 w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                                    <Ionicons name="mail-outline" size={20} color="#64748b" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="font-semibold text-on-surface text-lg">Submit Quarterly Report</Text>
                                    </View>
                                    <View className="flex-row items-center gap-3 mt-1">
                                        <View className="flex-row items-center gap-1">
                                            <Ionicons name="calendar-outline" size={14} color="#64748b" />
                                            <Text className="text-on-surface-variant text-sm">Oct 24</Text>
                                        </View>
                                        <View className="w-1 h-1 rounded-full bg-outline-variant" />
                                        <Text className="text-on-surface-variant text-sm">05:00 PM</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="mt-16 flex-row w-full justify-between gap-4 px-2">
                    <View className="flex-1 bg-primary p-6 rounded-[2.5rem] flex-col justify-between aspect-square shadow-lg shadow-primary/20">
                        <View className="bg-white/20 w-10 h-10 rounded-2xl items-center justify-center">
                            <Ionicons name="sparkles" size={20} color="#fff" />
                        </View>
                        <View>
                            <Text className="text-4xl font-extrabold tracking-tighter text-white">92%</Text>
                            <Text className="text-[10px] uppercase font-bold tracking-widest text-white/80">Efficiency Score</Text>
                        </View>
                    </View>
                    <View className="flex-1 bg-surface-container-high p-6 rounded-[2.5rem] flex-col justify-between aspect-square border border-outline-variant/10">
                        <View className="bg-on-surface/5 w-10 h-10 rounded-2xl items-center justify-center">
                            <Ionicons name="checkmark-done" size={20} color="#64748b" />
                        </View>
                        <View>
                            <Text className="text-4xl font-extrabold tracking-tighter text-on-surface">14</Text>
                            <Text className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Completed This Week</Text>
                        </View>
                    </View>
                </View>
                <Mic />
            </ScrollView>
        </ThemedSafeArea>
    )
}

export default Reminder