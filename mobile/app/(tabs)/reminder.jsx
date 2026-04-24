import { View, Text, FlatList, RefreshControl, TouchableOpacity, Modal, Alert } from 'react-native'
import { Ionicons, Entypo } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import ThemedSafeArea from '../../components/ThemedSafeArea'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Mic from '../../components/Mic'
import { useGetReminders, useUpdateReminder, useDeleteReminder } from '../../TranstackQuery/reminderQuery'
import Skeleton from '../../components/Skeleton'

const Reminder = () => {
    const { i18n } = useTranslation()
    const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en'
    
    const { data: reminders = [], isLoading, isRefetching, refetch } = useGetReminders()
    const { mutate: updateReminder } = useUpdateReminder()
    const { mutate: deleteReminder } = useDeleteReminder()

    const [selectedReminder, setSelectedReminder] = useState(null)
    const [showOptionsModal, setShowOptionsModal] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [datePickerMode, setDatePickerMode] = useState('date')

    const openOptions = (reminder) => {
        setSelectedReminder(reminder)
        setShowOptionsModal(true)
    }

    const handleDelete = () => {
        Alert.alert(
            i18n.language === "ar" ? "حذف التذكير" : "Delete Reminder",
            i18n.language === "ar" ? "هل أنت متأكد من حذف هذا التذكير؟" : "Are you sure you want to delete this reminder?",
            [
                { text: i18n.language === "ar" ? "إلغاء" : "Cancel", style: "cancel" },
                { 
                    text: i18n.language === "ar" ? "حذف" : "Delete", 
                    style: "destructive", 
                    onPress: () => {
                        deleteReminder(selectedReminder._id)
                        setShowOptionsModal(false)
                    } 
                }
            ]
        )
    }

    const handleUpdateDate = () => {
        setShowOptionsModal(false)
        setDatePickerMode('date')
        setShowDatePicker(true)
    }

    const onDateChange = (event, selectedDate) => {
        if (event.type === "dismissed") {
            setShowDatePicker(false)
            return
        }

        const currentDate = selectedDate || new Date(selectedReminder.date);
        
        if (datePickerMode === 'date') {
            setSelectedReminder({ ...selectedReminder, tempDate: currentDate })
            setDatePickerMode('time')
        } else {
            setShowDatePicker(false)
            
            // Combine date and time
            const finalDate = new Date(selectedReminder.tempDate)
            finalDate.setHours(currentDate.getHours())
            finalDate.setMinutes(currentDate.getMinutes())

            updateReminder({ id: selectedReminder._id, date: finalDate.toISOString() })
        }
    }

    const flatData = useMemo(() => {
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

        const data = []
        if (grouped.today.length > 0) {
            data.push({ type: 'header', title: i18n.language === "ar" ? "اليوم" : "Today" })
            grouped.today.forEach(item => data.push({ type: 'item', item }))
        }
        if (grouped.tomorrow.length > 0) {
            data.push({ type: 'header', title: i18n.language === "ar" ? "غداً" : "Tomorrow" })
            grouped.tomorrow.forEach(item => data.push({ type: 'item', item, isTomorrow: true }))
        }
        if (grouped.upcoming.length > 0) {
            data.push({ type: 'header', title: i18n.language === "ar" ? "قريباً" : "Upcoming" })
            grouped.upcoming.forEach(item => data.push({ type: 'item', item, isUpcoming: true }))
        }

        return data
    }, [reminders, i18n.language])

    const renderItem = ({ item }) => {
        if (item.type === 'header') {
            return (
                <Text className="text-md font-extrabold text-on-surface-variant uppercase tracking-widest mb-6 px-2 mt-4">
                    {item.title}
                </Text>
            )
        }

        const reminder = item.item
        const isUpcoming = item.isUpcoming
        const isTomorrow = item.isTomorrow

        return (
            <View className={`bg-surface-container-lowest p-6 rounded-xl flex-row items-start gap-4 mb-4 mx-2 ${(isUpcoming || isTomorrow) ? 'opacity-80' : ''}`}>
                <View className={`mt-1 w-10 h-10 rounded-full ${isUpcoming || isTomorrow ? 'bg-surface-container-high' : (reminder.action === 'call' ? 'bg-secondary-container' : 'bg-primary-container')} items-center justify-center`}>
                    <Ionicons 
                        name={reminder.action === 'call' ? "call-outline" : (isUpcoming ? "calendar-outline" : "notifications-outline")} 
                        size={20} 
                        color={isUpcoming || isTomorrow ? "#64748b" : (reminder.action === 'call' ? "#3b82f6" : "#005bc1")} 
                    />
                </View>
                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <Text className="font-semibold text-on-surface text-lg flex-1 mr-2">
                            {reminder.message?.[currentLang] || reminder.message?.en}
                        </Text>
                        <TouchableOpacity onPress={() => openOptions(reminder)} className="p-1">
                            <Entypo name="dots-three-horizontal" size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center gap-3 mt-1">
                        {isUpcoming && (
                            <>
                                <View className="flex-row items-center gap-1">
                                    <Ionicons name="calendar-outline" size={14} color="#64748b" />
                                    <Text className="text-on-surface-variant text-sm">
                                        {new Date(reminder.date).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View className="w-1 h-1 rounded-full bg-outline-variant" />
                            </>
                        )}
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="time-outline" size={14} color="#64748b" />
                            <Text className="text-on-surface-variant text-sm">
                                {new Date(reminder.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const Header = () => (
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
    )

    const Footer = () => (
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
    )

    const EmptyState = () => (
        <View className="py-12 items-center justify-center">
            <Ionicons name="calendar-clear-outline" size={64} color="#cbd5e1" />
            <Text className="text-on-surface-variant mt-4 font-medium">
                {i18n.language === "ar" ? "لا توجد تذكيرات حالياً" : "No upcoming reminders"}
            </Text>
        </View>
    )

    return (
        <ThemedSafeArea>
            {isLoading ? (
                <View className="flex-1">
                    <Header />
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
                </View>
            ) : (
                <FlatList
                    data={flatData}
                    keyExtractor={(item, index) => item.type === 'header' ? `header-${item.title}` : `item-${item.item._id}-${index}`}
                    renderItem={renderItem}
                    ListHeaderComponent={<Header />}
                    ListFooterComponent={<Footer />}
                    ListEmptyComponent={<EmptyState />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl 
                            refreshing={isRefetching && !isLoading} 
                            onRefresh={refetch} 
                            tintColor="#005bc1" 
                            colors={["#005bc1"]} 
                        />
                    }
                />
            )}
            
            <Modal visible={showOptionsModal} transparent animationType="fade">
                <TouchableOpacity 
                    className="flex-1 bg-black/50 justify-end" 
                    activeOpacity={1} 
                    onPress={() => setShowOptionsModal(false)}
                >
                    <View className="bg-surface p-6 rounded-t-3xl">
                        <Text className="text-on-surface text-lg font-bold mb-4">
                            {i18n.language === "ar" ? "خيارات التذكير" : "Reminder Options"}
                        </Text>
                        <TouchableOpacity 
                            className="flex-row items-center gap-4 py-4 border-b border-outline-variant/20"
                            onPress={handleUpdateDate}
                        >
                            <View className="w-10 h-10 rounded-full bg-primary-container items-center justify-center">
                                <Ionicons name="calendar-outline" size={20} color="#005bc1" />
                            </View>
                            <Text className="text-on-surface font-medium text-base">
                                {i18n.language === "ar" ? "تحديث الموعد" : "Update Date & Time"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            className="flex-row items-center gap-4 py-4"
                            onPress={handleDelete}
                        >
                            <View className="w-10 h-10 rounded-full bg-error-container items-center justify-center">
                                <Ionicons name="trash-outline" size={20} color="#ba1a1a" />
                            </View>
                            <Text className="text-error font-medium text-base">
                                {i18n.language === "ar" ? "حذف التذكير" : "Delete Reminder"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedReminder?.tempDate ? new Date(selectedReminder.tempDate) : selectedReminder?.date ? new Date(selectedReminder.date) : new Date()}
                    mode={datePickerMode}
                    is24Hour={true}
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <Mic />
        </ThemedSafeArea>
    )
}

export default Reminder