import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ThemedSafeArea from '../../components/ThemedSafeArea'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Mic from '../../components/Mic'
import { useGetReminders } from '../../TranstackQuery/reminderQuery'
import Skeleton from '../../components/Skeleton'

const Reminder = () => {
    const { i18n } = useTranslation()
    const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en'
    
    const { data: reminders = [], isLoading } = useGetReminders()

    const groupedReminders = useMemo(() => {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const isSameDay = (d1, d2) => 
            d1.getDate() === d2.getDate() && 
            d1.getMonth() === d2.getMonth() && 
            d1.getFullYear() === d2.getFullYear()

        const grouped = { today: [], tomorrow: [], upcoming: [] }

        reminders.forEach(reminder => {
            const d = new Date(reminder.date)
            if (isSameDay(d, today)) grouped.today.push(reminder)
            else if (isSameDay(d, tomorrow)) grouped.tomorrow.push(reminder)
            else grouped.upcoming.push(reminder)
        })

        return grouped
    }, [reminders])

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
                    {isLoading ? (
                        <View className="px-2 space-y-4">
                            <Skeleton width={100} height={20} radius={4} style={{ marginBottom: 16 }} />
                            <View className="bg-surface-container-lowest p-6 rounded-xl flex-row items-start gap-4 mb-4">
                                <Skeleton width={40} height={40} radius={20} />
                                <View className="flex-1">
                                    <Skeleton width={150} height={16} radius={4} style={{ marginBottom: 8 }} />
                                    <Skeleton width={80} height={12} radius={4} />
                                </View>
                            </View>
                            <View className="bg-surface-container-lowest p-6 rounded-xl flex-row items-start gap-4 mb-4">
                                <Skeleton width={40} height={40} radius={20} />
                                <View className="flex-1">
                                    <Skeleton width={150} height={16} radius={4} style={{ marginBottom: 8 }} />
                                    <Skeleton width={80} height={12} radius={4} />
                                </View>
                            </View>
                        </View>
                    ) : (
                        <>
                            {groupedReminders.today.length > 0 && (
                                <View>
                                    <Text className="text-md font-extrabold text-on-surface-variant uppercase tracking-widest mb-6 px-2">
                                        {i18n.language === "ar" ? "اليوم" : "Today"}
                                    </Text>
                                    <View className="space-y-3">
                                        {groupedReminders.today.map((reminder, idx) => (
                                            <View key={reminder._id || idx} className="bg-surface-container-lowest p-6 rounded-xl flex-row items-start gap-4 mb-4">
                                                <View className={`mt-1 w-10 h-10 rounded-full ${reminder.action === 'call' ? 'bg-secondary-container' : 'bg-primary-container'} items-center justify-center`}>
                                                    <Ionicons name={reminder.action === 'call' ? "call-outline" : "notifications-outline"} size={20} color={reminder.action === 'call' ? "#3b82f6" : "#005bc1"} />
                                                </View>
                                                <View className="flex-1">
                                                    <View className="flex-row justify-between items-start">
                                                        <Text className="font-semibold text-on-surface text-lg">
                                                            {reminder.message?.[currentLang] || reminder.message?.en}
                                                        </Text>
                                                    </View>
                                                    <View className="flex-row items-center gap-3 mt-1">
                                                        <View className="flex-row items-center gap-1">
                                                            <Ionicons name="time-outline" size={14} color="#64748b" />
                                                            <Text className="text-on-surface-variant text-sm">
                                                                {new Date(reminder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {groupedReminders.tomorrow.length > 0 && (
                                <View>
                                    <Text className="text-md font-extrabold text-on-surface-variant uppercase tracking-widest mb-6 px-2">
                                        {i18n.language === "ar" ? "غداً" : "Tomorrow"}
                                    </Text>
                                    <View className="space-y-3">
                                        {groupedReminders.tomorrow.map((reminder, idx) => (
                                            <View key={reminder._id || idx} className="bg-surface-container-low p-6 rounded-xl flex-row items-start gap-4 mb-4 opacity-80">
                                                <View className="mt-1 w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                                                    <Ionicons name={reminder.action === 'call' ? "call-outline" : "calendar-outline"} size={20} color="#64748b" />
                                                </View>
                                                <View className="flex-1">
                                                    <View className="flex-row justify-between items-start">
                                                        <Text className="font-semibold text-on-surface text-lg">
                                                            {reminder.message?.[currentLang] || reminder.message?.en}
                                                        </Text>
                                                    </View>
                                                    <View className="flex-row items-center gap-3 mt-1">
                                                        <View className="flex-row items-center gap-1">
                                                            <Ionicons name="time-outline" size={14} color="#64748b" />
                                                            <Text className="text-on-surface-variant text-sm">
                                                                {new Date(reminder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                            
                            {groupedReminders.upcoming.length > 0 && (
                                <View>
                                    <Text className="text-md font-extrabold text-on-surface-variant uppercase tracking-widest mb-6 px-2 mt-4">
                                        {i18n.language === "ar" ? "قريباً" : "Upcoming"}
                                    </Text>
                                    <View className="space-y-3">
                                        {groupedReminders.upcoming.map((reminder, idx) => (
                                            <View key={reminder._id || idx} className="bg-surface-container-lowest p-6 rounded-xl flex-row items-start gap-4 mb-4 opacity-60">
                                                <View className="mt-1 w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
                                                    <Ionicons name="calendar-outline" size={20} color="#64748b" />
                                                </View>
                                                <View className="flex-1">
                                                    <View className="flex-row justify-between items-start">
                                                        <Text className="font-semibold text-on-surface text-lg">
                                                            {reminder.message?.[currentLang] || reminder.message?.en}
                                                        </Text>
                                                    </View>
                                                    <View className="flex-row items-center gap-3 mt-1">
                                                        <View className="flex-row items-center gap-1">
                                                            <Ionicons name="calendar-outline" size={14} color="#64748b" />
                                                            <Text className="text-on-surface-variant text-sm">
                                                                {new Date(reminder.date).toLocaleDateString()}
                                                            </Text>
                                                        </View>
                                                        <View className="w-1 h-1 rounded-full bg-outline-variant" />
                                                        <Text className="text-on-surface-variant text-sm">
                                                            {new Date(reminder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {groupedReminders.today.length === 0 && groupedReminders.tomorrow.length === 0 && groupedReminders.upcoming.length === 0 && (
                                <View className="py-12 items-center justify-center">
                                    <Ionicons name="calendar-clear-outline" size={64} color="#cbd5e1" />
                                    <Text className="text-on-surface-variant mt-4 font-medium">
                                        {i18n.language === "ar" ? "لا توجد تذكيرات حالياً" : "No upcoming reminders"}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
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