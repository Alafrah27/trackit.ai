import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import ThemedSafeArea from '../../components/ThemedSafeArea';
import Skeleton from '../../components/Skeleton';
import { useGetInsights } from '../../TranstackQuery/insightQuery';
import { useTranslation } from 'react-i18next';
import Mic from '../../components/Mic';

// Transformation for GiftedCharts
const getChartData = (values = [], t) => {
    const labels = [
        t('insights.months.January').charAt(0),
        t('insights.months.February').charAt(0),
        t('insights.months.March').charAt(0),
        t('insights.months.April').charAt(0),
        t('insights.months.May').charAt(0),
        t('insights.months.June').charAt(0)
    ];
    return values.map((val, i) => ({
        value: val,
        label: labels[i] || `W${i + 1}`,
        frontColor: i % 2 === 0 ? '#005bc1' : '#3b82f6',
        labelTextStyle: { color: '#64748b', fontSize: 11, fontWeight: 'bold' },
    }));
};

const Insights = () => {
    const { t, i18n } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const now = new Date();
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(now.getMonth()); // 0-indexed
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const selectedMonth = months[selectedMonthIndex];

    // ── TanStack Query ─────────────────────────────────────────────
    const {
        data: insights,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetInsights(selectedMonthIndex + 1, selectedYear); // API expects 1-indexed

    const total = insights?.total ?? 0;
    const chart = insights?.chart ?? [];
    const categories = insights?.categories ?? [];
    const comparison = insights?.comparison ?? {};

    // Helper to get localised category title
    const lang = i18n.language || 'en';
    const getCategoryTitle = (titleObj) => {
        if (typeof titleObj === 'string') return titleObj;
        return titleObj?.[lang] || titleObj?.en || '';
    };

    // ── AI insight text ─────────────────────────────────────────────
    const getAiInsightText = () => {
        if (!comparison || comparison.changePercent === undefined) {
            return t('insights.aiInsightStable');
        }
        if (comparison.trend === 'up') {
            return t('insights.aiInsightUp', {
                percent: Math.abs(comparison.changePercent),
                defaultValue: `Your spending increased by ${Math.abs(comparison.changePercent)}% compared to last month.`,
            });
        }
        if (comparison.trend === 'down') {
            return t('insights.aiInsightDown', {
                percent: Math.abs(comparison.changePercent),
                defaultValue: `Great! You saved ${Math.abs(comparison.changePercent)}% compared to last month.`,
            });
        }
        return t('insights.aiInsightStable');
    };

    return (
        <ThemedSafeArea>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            >
                {/* Header Section */}
                <View className="flex-row justify-between items-center py-6">
                    <View>
                        <Text className="text-on-surface text-3xl font-bold">
                            {t('insights.title')}
                        </Text>
                        <Text className="text-on-surface-variant font-medium">
                            {t('insights.subtitle')}
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="bg-primary/10 px-4 py-2.5 rounded-full flex-row items-center border border-primary/20"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="download-outline" size={20} color="#005bc1" />
                        <Text className="text-primary font-bold ml-2">
                            {t('insights.export')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Error State */}
                {isError && !isLoading && (
                    <View className="bg-red-50 dark:bg-red-900/20 p-6 rounded-[32px] mb-8 items-center">
                        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                        <Text className="text-red-600 dark:text-red-400 text-lg font-bold mt-3">
                            {t('insights.errorTitle', { defaultValue: 'Failed to load insights' })}
                        </Text>
                        <Text className="text-red-500/70 text-sm text-center mt-1 mb-4">
                            {t('insights.errorSubtitle', { defaultValue: 'Please check your connection and try again.' })}
                        </Text>
                        <TouchableOpacity
                            onPress={() => refetch()}
                            className="bg-primary px-6 py-3 rounded-full"
                        >
                            <Text className="text-white font-bold">
                                {t('insights.retry', { defaultValue: 'Retry' })}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Main Spending & Chart Card */}
                <View className="bg-white/60 dark:bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/10 shadow-sm mb-8">
                    <View className="flex-row justify-between items-start mb-6">
                        <View className="flex-1">
                            <Text className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">
                                {t('insights.totalSpending')} ({t(`insights.months.${selectedMonth}`)})
                            </Text>
                            {isLoading ? (
                                <View className="mt-2">
                                    <Skeleton width={200} height={45} radius={12} />
                                </View>
                            ) : (
                                <View className="flex-row items-baseline mt-1">
                                    <Text className="text-on-surface text-5xl font-bold">${total}</Text>
                                    <Text className="text-on-surface-variant text-lg font-medium ml-2">.00</Text>
                                    {isFetching && !isLoading && (
                                        <ActivityIndicator size="small" color="#005bc1" style={{ marginLeft: 8 }} />
                                    )}
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            className="bg-surface-container-high w-10 h-10 rounded-full items-center justify-center"
                        >
                            <Ionicons name="ellipsis-vertical" size={24} color="#005bc1" />
                        </TouchableOpacity>
                    </View>

                    {/* Chart Skeleton vs Real Component */}
                    {isLoading ? (
                        <View className="items-center mt-4">
                            <View className="flex-row items-end justify-between w-full h-[180px] px-2 mb-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Skeleton key={i} width={36} height={Math.random() * 100 + 50} radius={12} />
                                ))}
                            </View>
                            <Skeleton width="80%" height={10} radius={4} />
                        </View>
                    ) : (
                        <View className="items-center -ml-4">
                            <BarChart
                                data={getChartData(chart, t)}
                                barWidth={36}
                                noOfSections={3}
                                barBorderRadius={12}
                                frontColor="#005bc1"
                                yAxisThickness={0}
                                xAxisThickness={0}
                                hideRules
                                isAnimated
                                animationDuration={1000}
                                height={180}
                                width={280}
                                showLine={false}
                                spacing={18}
                                initialSpacing={10}
                                textColor="#64748b"
                                dashGap={0}
                                yAxisTextStyle={{ color: '#94a3b8', fontSize: 10 }}
                            />
                        </View>
                    )}
                </View>

                {/* Analysis Breakdown */}
                <View>
                    <Text className="text-on-surface text-2xl font-bold mb-6">
                        {t('insights.detailedAnalysis')}
                    </Text>

                    {isLoading ? (
                        <View className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <View key={i} className="bg-white/60 dark:bg-surface-container-low p-5 rounded-[28px] border border-outline-variant/10 flex-row items-center mb-4">
                                    <Skeleton width={48} height={48} radius={16} style={{ marginRight: 16 }} />
                                    <View className="flex-1">
                                        <Skeleton width="60%" height={20} radius={4} />
                                        <Skeleton width="100%" height={8} radius={4} style={{ marginTop: 12 }} />
                                    </View>
                                    <View className="ml-4 items-end">
                                        <Skeleton width={60} height={20} radius={4} />
                                        <Skeleton width={30} height={12} radius={4} style={{ marginTop: 4 }} />
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : categories.length === 0 && !isError ? (
                        <View className="bg-white/60 dark:bg-surface-container-low p-8 rounded-[28px] border border-outline-variant/10 items-center">
                            <Ionicons name="pie-chart-outline" size={48} color="#94a3b8" />
                            <Text className="text-on-surface-variant text-lg font-bold mt-3">
                                {t('insights.noData', { defaultValue: 'No expenses this month' })}
                            </Text>
                            <Text className="text-on-surface-variant/60 text-sm text-center mt-1">
                                {t('insights.noDataSubtitle', { defaultValue: 'Start tracking your expenses to see insights here.' })}
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-4">
                            {categories.map((item, i) => (
                                <View
                                    key={i}
                                    className="bg-white/60 dark:bg-surface-container-low p-5 rounded-[28px] border border-outline-variant/10 flex-row items-center mb-4"
                                >
                                    <View style={{ backgroundColor: item.color + '20' }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name={item.icon} size={24} color={item.color} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-on-surface text-lg font-bold">
                                            {getCategoryTitle(item.title)}
                                        </Text>
                                        <View className="h-1.5 bg-surface-container-high rounded-full w-full mt-2 overflow-hidden">
                                            <View
                                                style={{ width: item.percent, backgroundColor: item.color }}
                                                className="h-full rounded-full"
                                            />
                                        </View>
                                    </View>
                                    <View className="items-end ml-4">
                                        <Text className="text-on-surface font-bold text-lg">${item.amount}</Text>
                                        <Text className="text-on-surface-variant text-xs font-bold">{item.percent}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* AI Insight Card */}
                {isLoading ? (
                    <View className="mt-4">
                        <Skeleton height={100} radius={32} />
                    </View>
                ) : !isError && (
                    <TouchableOpacity className="bg-primary p-6 rounded-[32px] mt-4 flex-row items-center border border-white/10 shadow-lg shadow-primary/30">
                        <View className="bg-white/20 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                            <Ionicons name="sparkles" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold">
                                {t('insights.aiInsightTitle', { month: t(`insights.months.${selectedMonth}`) })}
                            </Text>
                            <Text className="text-white/80 text-sm">
                                {getAiInsightText()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setModalVisible(false)}>
                    <View className="bg-white dark:bg-surface-container rounded-t-[40px] p-6 pb-12">
                        <View className="w-12 h-1.5 bg-outline-variant/30 rounded-full self-center mb-6" />
                        <Text className="text-on-surface text-2xl font-bold mb-6 text-center">
                            {t('insights.selectMonth')}
                        </Text>
                        <FlatList
                            data={months}
                            keyExtractor={(item) => item}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedMonthIndex(index);
                                        setModalVisible(false);
                                    }}
                                    className={`py-5 border-b border-outline-variant/5 items-center ${selectedMonthIndex === index ? 'bg-primary/5 rounded-2xl' : ''}`}
                                >
                                    <Text className={`text-xl ${selectedMonthIndex === index ? 'text-primary font-bold' : 'text-on-surface'}`}>
                                        {t(`insights.months.${item}`)}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: 400 }}
                        />
                    </View>
                </Pressable>
            </Modal>
            <Mic />
        </ThemedSafeArea>
    );
};

export default Insights;
