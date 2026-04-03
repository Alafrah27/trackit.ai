import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from "react-native-gifted-charts";
import ThmedSafeArea from '../../components/ThmedSafeArea';
import Skeleton from '../../components/Skeleton';

// Transformation for GiftedCharts
const getChartData = (values) => {
    const labels = ['J', 'F', 'M', 'A', 'M', 'J'];
    return values.map((val, i) => ({
        value: val,
        label: labels[i],
        frontColor: i % 2 === 0 ? '#005bc1' : '#3b82f6',
        labelTextStyle: { color: '#64748b', fontSize: 11, fontWeight: 'bold' },
    }));
};

// Mock Data for different months
const monthRecords = {
    'January': {
        total: 4250,
        chart: [80, 45, 95, 60, 30, 70],
        categories: [
            { title: 'Food & Groceries', amount: '$1,200', percent: '28%', icon: 'fast-food', color: '#f97316' },
            { title: 'Transport', amount: '$850', percent: '15%', icon: 'car', color: '#3b82f6' },
            { title: 'Entertainment', amount: '$600', percent: '12%', icon: 'film', color: '#ec4899' }
        ]
    },
    'February': {
        total: 3120,
        chart: [40, 60, 30, 90, 50, 40],
        categories: [
            { title: 'Food & Groceries', amount: '$900', percent: '20%', icon: 'fast-food', color: '#f97316' },
            { title: 'Transport', amount: '$450', percent: '10%', icon: 'car', color: '#3b82f6' },
            { title: 'Rent', amount: '$1,500', percent: '35%', icon: 'home', color: '#10b981' }
        ]
    },
    'March': {
        total: 5400,
        chart: [90, 80, 70, 60, 50, 95],
        categories: [
            { title: 'Shopping', amount: '$2,100', percent: '40%', icon: 'cart', color: '#ec4899' },
            { title: 'Education', amount: '$1,200', percent: '22%', icon: 'book', color: '#a855f7' },
            { title: 'Entertainment', amount: '$800', percent: '15%', icon: 'film', color: '#005bc1' }
        ]
    },
    'default': {
        total: 2800,
        chart: [50, 50, 50, 50, 50, 50],
        categories: [
            { title: 'General', amount: '$1,000', percent: '10%', icon: 'apps', color: '#64748b' }
        ]
    }
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Insights = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [isLoading, setIsLoading] = useState(false);
    const [currentData, setCurrentData] = useState(monthRecords['January']);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setCurrentData(monthRecords[selectedMonth] || monthRecords['default']);
            setIsLoading(false);
        }, 800); // 800ms to show the pulse effect clearly
        return () => clearTimeout(timer);
    }, [selectedMonth]);

    return (
        <ThmedSafeArea>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
            >
                {/* Header Section */}
                <View className="flex-row justify-between items-center py-6">
                    <View>
                        <Text className="text-on-surface text-3xl font-bold">Insights</Text>
                        <Text className="text-on-surface-variant font-medium">Spending Analysis</Text>
                    </View>
                    <TouchableOpacity 
                        className="bg-primary/10 px-4 py-2.5 rounded-full flex-row items-center border border-primary/20"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="download-outline" size={20} color="#005bc1" />
                        <Text className="text-primary font-bold ml-2">Export</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Spending & Chart Card */}
                <View className="bg-white/60 dark:bg-surface-container-low p-6 rounded-[32px] border border-outline-variant/10 shadow-sm mb-8">
                    <View className="flex-row justify-between items-start mb-6">
                        <View className="flex-1">
                            <Text className="text-on-surface-variant text-sm font-bold uppercase tracking-wider">Total Spending ({selectedMonth})</Text>
                            {isLoading ? (
                                <View className="mt-2">
                                    <Skeleton width={200} height={45} radius={12} />
                                </View>
                            ) : (
                                <View className="flex-row items-baseline mt-1">
                                    <Text className="text-on-surface text-5xl font-bold">${currentData.total}</Text>
                                    <Text className="text-on-surface-variant text-lg font-medium ml-2">.00</Text>
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
                                data={getChartData(currentData.chart)}
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
                    <Text className="text-on-surface text-2xl font-bold mb-6">Detailed Analysis</Text>
                    
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
                    ) : (
                        <View className="space-y-4">
                            {currentData.categories.map((item, i) => (
                                <View 
                                    key={i} 
                                    className="bg-white/60 dark:bg-surface-container-low p-5 rounded-[28px] border border-outline-variant/10 flex-row items-center mb-4"
                                >
                                    <View style={{ backgroundColor: item.color + '20' }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons name={item.icon} size={24} color={item.color} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-on-surface text-lg font-bold">{item.title}</Text>
                                        <View className="h-1.5 bg-surface-container-high rounded-full w-full mt-2 overflow-hidden">
                                            <View 
                                                style={{ width: item.percent, backgroundColor: item.color }} 
                                                className="h-full rounded-full" 
                                            />
                                        </View>
                                    </View>
                                    <View className="items-end ml-4">
                                        <Text className="text-on-surface font-bold text-lg">{item.amount}</Text>
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
                ) : (
                    <TouchableOpacity className="bg-primary p-6 rounded-[32px] mt-4 flex-row items-center border border-white/10 shadow-lg shadow-primary/30">
                        <View className="bg-white/20 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                            <Ionicons name="sparkles" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold">AI Insight for {selectedMonth}</Text>
                            <Text className="text-white/80 text-sm">
                                {selectedMonth === 'March' ? 'Your Shopping is up by 40%. Consider setting a budget.' : 'Your spending is stable. Keep tracking!'}
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
                        <Text className="text-on-surface text-2xl font-bold mb-6 text-center">Select Month</Text>
                        <FlatList
                            data={months}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    onPress={() => {
                                        setSelectedMonth(item);
                                        setModalVisible(false);
                                    }}
                                    className={`py-5 border-b border-outline-variant/5 items-center ${selectedMonth === item ? 'bg-primary/5 rounded-2xl' : ''}`}
                                >
                                    <Text className={`text-xl ${selectedMonth === item ? 'text-primary font-bold' : 'text-on-surface'}`}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: 400 }}
                        />
                    </View>
                </Pressable>
            </Modal>
        </ThmedSafeArea>
    );
};

export default Insights;




