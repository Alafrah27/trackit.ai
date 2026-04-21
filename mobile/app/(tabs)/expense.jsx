import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Pressable, StyleSheet, Dimensions, FlatList, RefreshControl } from 'react-native'
import ThemedSafeArea from '../../components/ThemedSafeArea'
import { Ionicons } from '@expo/vector-icons'
import { useGetExpenses, useGetTotalExpenses } from '../../TranstackQuery/expenseQuery'
import Skeleton from '../../components/Skeleton'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

const ExpenseSkeleton = () => {
    return (
        <ThemedSafeArea style={{ backgroundColor: '#005bc1' }}>
            <ScrollView className="flex-1 pt-6 px-4" showsVerticalScrollIndicator={false}>
                {/* Card Skeleton */}
                <View className="bg-surface-container rounded-3xl p-6 shadow-lg border border-outline-variant/5 w-full my-8">
                    <Skeleton width={120} height={12} radius={4} style={{ marginBottom: 12 }} />
                    <Skeleton width="70%" height={40} radius={8} style={{ marginBottom: 24 }} />
                    <View className="flex-row justify-between">
                        <View>
                            <Skeleton width={80} height={10} radius={4} style={{ marginBottom: 6 }} />
                            <Skeleton width={100} height={16} radius={4} />
                        </View>
                        <Skeleton width={80} height={40} radius={16} />
                    </View>
                </View>

                {/* Grid Skeletons */}
                <View className="flex-row w-full gap-4 mt-4">
                    <View className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/10">
                        <Skeleton width={24} height={24} radius={12} style={{ marginBottom: 12, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <Skeleton width={80} height={10} radius={4} style={{ marginBottom: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <Skeleton width={100} height={20} radius={4} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                    </View>
                    <View className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/10">
                        <Skeleton width={24} height={24} radius={12} style={{ marginBottom: 12, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <Skeleton width={80} height={10} radius={4} style={{ marginBottom: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <Skeleton width={100} height={20} radius={4} style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                    </View>
                </View>

                {/* List Skeleton */}
                <View className="mt-10">
                    <Skeleton width={120} height={18} radius={4} style={{ marginBottom: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <View key={i} className="flex-row items-center justify-between p-4 rounded-3xl bg-surface-container mt-3">
                            <View className="flex-row items-center gap-4">
                                <Skeleton width={48} height={48} radius={24} />
                                <View>
                                    <Skeleton width={120} height={14} radius={4} style={{ marginBottom: 6 }} />
                                    <Skeleton width={80} height={10} radius={4} />
                                </View>
                            </View>
                            <Skeleton width={60} height={16} radius={4} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ThemedSafeArea>
    )
}

const Expense = () => {
    const { data: expenses, isLoading: expensesLoading, refetch: refetchExpenses, isRefetching: isRefetchingExpenses } = useGetExpenses()
    const { data: totalData, isLoading: totalLoading, refetch: refetchTotal, isRefetching: isRefetchingTotal } = useGetTotalExpenses()
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language?.startsWith('ar') ? 'ar' : 'en'

    const [selectedExpense, setSelectedExpense] = useState(null)
    const [sheetVisible, setSheetVisible] = useState(false)

    const openDetails = (expense) => {
        setSelectedExpense(expense)
        setSheetVisible(true)
    }

    if (expensesLoading || totalLoading) {
        return <ExpenseSkeleton />
    }

    const onRefresh = async () => {
        await Promise.all([refetchExpenses(), refetchTotal()])
    }

    const renderHeader = () => (
        <View className="pt-6">
            {/* The Floating Expense Card */}
            <View
                className="bg-surface-container rounded-3xl p-6 shadow-lg border border-outline-variant/5 w-full my-8 z-10"
                style={{ elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 15 }}
            >
                <View className="">
                    <Text className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-2">
                        {t('expense.totalExpenses')}
                    </Text>
                    <Text className="text-5xl font-bold text-on-surface mb-6">${totalData?.totalExpenses?.toFixed(2) || '0.00'}</Text>
                </View>

                <View className="flex-row items-center justify-between min-w-full" style={{ width: '100%' }}>
                    <View>
                        <Text className="text-on-surface-variant text-xs mb-1">
                            {t('expense.monthlyGoal')}
                        </Text>
                        <Text className="text-on-surface font-semibold">$2,000.00</Text>
                    </View>
                    <View className="h-10 flex justify-end mx-4" />
                    <TouchableOpacity className="items-center justify-center py-3 rounded-2xl">
                        <Text className="text-[#005bc1] font-bold text-sm">
                            {t('expense.scanBill')}
                        </Text>
                        <Ionicons name="camera" size={20} color="#005bc1" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom List Content */}
            <View className="flex-row w-full z-10 px-2 mt-10">
                <TouchableOpacity className="flex-1 bg-white/15 p-4 flex-col rounded-2xl border border-white/10 mr-2">
                    <Ionicons name="trending-up-outline" size={24} color="white" style={{ marginBottom: 8 }} />
                    <Text className='text-white/80 text-xs mb-1'>
                        {t('expense.highestSpend')}
                    </Text>
                    <Text className='text-white font-bold text-lg'>${totalData?.highestExpense?.toFixed(2) || '0.00'}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white/15 p-4 flex-col rounded-2xl border border-white/10 ml-2">
                    <Ionicons name="wallet-outline" size={24} color="white" style={{ marginBottom: 8 }} />
                    <Text className='text-white/80 text-xs mb-1'>
                        {t('expense.dailyAverage')}
                    </Text>
                    <Text className='text-white font-bold text-lg'>${totalData?.dailyAverage?.toFixed(2) || '0.00'}</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between mt-6 px-4">
                <Text className="text-sm font-bold text-white tracking-tight">
                    {t('expense.recentActivity')}
                </Text>
                <TouchableOpacity className="text-white text-xs font-semibold hover:opacity-70">
                    <Text className='text-sm font-bold text-white tracking-tight'>
                        {t('expense.viewReport')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderExpenseItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => openDetails(item)}
            className="flex-row items-center justify-between p-4 rounded-3xl bg-surface-container mt-3"
        >
            <View className="flex-row items-center gap-4 flex-1 mr-4">
                <View className="w-12 h-12 rounded-full bg-surface items-center justify-center shrink-0">
                    <Ionicons name="receipt-outline" size={24} color="#005bc1" />
                </View>
                <View className="flex-1">
                    <Text numberOfLines={1} className="text-sm font-bold text-on-surface">{item.title?.[currentLang] || item.title?.en || t('common.expense')}</Text>
                    <View className="flex-row items-center mt-1">
                        <Text numberOfLines={1} className="text-[10px] text-on-surface-variant bg-surface px-2 py-0.5 rounded-full mr-2">
                            {item.category?.[currentLang] || item.category?.en}
                        </Text>
                        <Text className="text-[10px] text-on-surface-variant">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="items-end shrink-0">
                <Text className="text-base font-bold text-[#005bc1]">-${item.amount.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <ThemedSafeArea style={{ backgroundColor: '#005bc1' }}>
            <FlatList
                data={expenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetchingExpenses || isRefetchingTotal}
                        onRefresh={onRefresh}
                        tintColor="white"
                        colors={['#005bc1']}
                    />
                }
                ListEmptyComponent={() => (
                    <View className="p-10 items-center">
                        <Text className="text-white font-medium">
                            {t('expense.noExpenses')}
                        </Text>
                    </View>
                )}
            />

            {/* Expense Detail Sheet */}
            <Modal
                transparent
                visible={sheetVisible}
                animationType="slide"
                onRequestClose={() => setSheetVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setSheetVisible(false)}
                    />
                    <View style={styles.sheet}>
                        <View style={styles.handle} />

                        <View className="p-6">
                            <View className="flex-row justify-between items-start mb-6">
                                <View className="flex-1 mr-4">
                                    <Text className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">
                                        {t('expense.details')}
                                    </Text>
                                    <Text className="text-2xl font-bold text-on-surface">
                                        {selectedExpense?.title?.[currentLang] || selectedExpense?.title?.en}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setSheetVisible(false)}
                                    className="w-10 h-10 items-center justify-center bg-surface rounded-full"
                                >
                                    <Ionicons name="close" size={24} color="#888" />
                                </TouchableOpacity>
                            </View>

                            <View className="space-y-4">
                                <View className="flex-row justify-between py-4 border-b border-outline-variant/10">
                                    <Text className="text-on-surface-variant">
                                        {t('expense.amount')}
                                    </Text>
                                    <Text className="text-xl font-bold text-[#005bc1]">-${selectedExpense?.amount?.toFixed(2)}</Text>
                                </View>

                                <View className="flex-row justify-between py-4 border-b border-outline-variant/10">
                                    <Text className="text-on-surface-variant">
                                        {t('expense.category')}
                                    </Text>
                                    <Text className="font-semibold text-on-surface">
                                        {selectedExpense?.category?.[currentLang] || selectedExpense?.category?.en}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between py-4 border-b border-outline-variant/10">
                                    <Text className="text-on-surface-variant">
                                        {t('expense.date')}
                                    </Text>
                                    <Text className="text-on-surface">
                                        {selectedExpense?.createdAt ? new Date(selectedExpense.createdAt).toLocaleDateString() : ''}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                className="mt-8 bg-[#005bc1] p-5 rounded-3xl items-center"
                                onPress={() => setSheetVisible(false)}
                            >
                                <Text className="text-white font-bold text-lg">
                                    {t('common.close')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedSafeArea>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    sheet: {
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
    }
})

export default Expense