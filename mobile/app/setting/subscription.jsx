import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGetPlans } from '../../TranstackQuery/planQuery';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTranslation } from 'react-i18next';

import Skeleton from '../../components/Skeleton';

const { width } = Dimensions.get('window');

const SubscriptionSkeleton = () => (
    <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
            <Skeleton width={40} height={40} radius={20} />
            <View className="ml-4">
                <Skeleton width={150} height={24} />
            </View>
        </View>
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            <View className="mt-8 mb-10 items-center">
                <Skeleton width={250} height={32} style={{ marginBottom: 12 }} />
                <Skeleton width={width - 80} height={20} />
            </View>
            {[1, 2, 3].map((i) => (
                <View key={i} className="mb-6 p-6 rounded-[32px] border border-outline-variant/20 bg-white">
                    <View className="flex-row items-center mb-4">
                        <Skeleton width={48} height={48} radius={16} style={{ marginRight: 16 }} />
                        <View>
                            <Skeleton width={100} height={20} style={{ marginBottom: 6 }} />
                            <Skeleton width={80} height={14} />
                        </View>
                    </View>
                    <Skeleton width={120} height={40} style={{ marginBottom: 16 }} />
                    <View className="space-y-3">
                        <Skeleton width={width - 100} height={16} />
                        <Skeleton width={width - 120} height={16} />
                        <Skeleton width={width - 140} height={16} />
                    </View>
                    <Skeleton width="100%" height={56} radius={16} style={{ marginTop: 24 }} />
                </View>
            ))}
        </ScrollView>
    </SafeAreaView>
);

const Subscription = () => {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const { data: plans, isLoading, error } = useGetPlans();
    const [selectedPlanId, setSelectedPlanId] = useState(null);

    const currentLanguage = i18n.language;
    const isArabic = currentLanguage === 'ar';

    const getPlanColor = (planType) => {
        switch (planType) {
            case 'pro': return '#005bc1';
            case 'pro_plus': return '#6200ee';
            default: return '#888888';
        }
    };

    const getPlanIcon = (planType) => {
        switch (planType) {
            case 'pro': return 'rocket-outline';
            case 'pro_plus': return 'diamond-outline';
            default: return 'leaf-outline';
        }
    };

    if (isLoading) {
        return <SubscriptionSkeleton />;
    }

    if (!plans || plans?.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-surface">
                <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center bg-white shadow-sm rounded-full"
                    >
                        <Ionicons name={i18n.language === 'ar' ? "arrow-forward" : "arrow-back"} size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="ml-4 text-2xl font-bold text-on-surface">
                        {t('subscription.title')}
                    </Text>
                </View>
                <View className="flex-1 justify-center items-center bg-surface">
                    <Text className="text-2xl font-bold text-on-surface">
                        {t('subscription.noPlans')}
                    </Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-surface">
            {/* Header */}
            <View className="flex-row items-center px-6 py-4 border-b border-outline-variant/10">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center bg-white shadow-sm rounded-full"
                >
                    <Ionicons name={i18n.language === 'ar' ? "arrow-forward" : "arrow-back"} size={24} color="black" />
                </TouchableOpacity>
                <Text className="ml-4 text-2xl font-bold text-on-surface">
                    {t('subscription.title')}
                </Text>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View className="mt-8 mb-10 items-center">
                    <Text className="text-3xl font-extrabold text-on-surface text-center">
                        {t('subscription.header')}
                    </Text>
                    <Text className="text-on-surface-variant text-lg mt-2 text-center px-4">
                        {t('subscription.subheader')}
                    </Text>
                </View>

                {plans?.map((plan) => (
                    <TouchableOpacity
                        key={plan._id}
                        onPress={() => setSelectedPlanId(plan._id)}
                        activeOpacity={0.9}
                        className={`mb-6 p-6 rounded-[32px] border-2 shadow-sm relative overflow-hidden bg-white ${selectedPlanId === plan._id ? 'border-primary' : 'border-outline-variant/20'
                            }`}
                    >
                        {plan.plan === 'pro_plus' && (
                            <View className="absolute top-0 right-0 bg-primary px-4 py-1 rounded-bl-2xl">
                                <Text className="text-white text-xs font-bold uppercase">
                                    {t('subscription.mostPopular')}
                                </Text>
                            </View>
                        )}

                        <View className="flex-row items-center mb-4">
                            <View
                                style={{ backgroundColor: `${getPlanColor(plan.plan)}20` }}
                                className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                            >
                                <Ionicons name={getPlanIcon(plan.plan)} size={28} color={getPlanColor(plan.plan)} />
                            </View>
                            <View>
                                <Text className="text-xl font-bold text-on-surface capitalize">
                                    {plan.plan.replace('_', ' ')}
                                </Text>
                                <Text className="text-on-surface-variant text-sm">
                                    {plan.amount === 0 ? t('subscription.freeForever') : t('subscription.premiumPlan')}
                                </Text>
                            </View>
                        </View>

                        <View className="mb-6">
                            <View className="flex-row items-baseline mb-2">
                                <Text className="text-4xl font-black text-on-surface">${plan.amount}</Text>
                                <Text className="text-on-surface-variant ml-1 font-medium">/{t('subscription.month')}</Text>
                            </View>

                            <View className="mt-4 space-y-3">
                                {(plan.description[currentLanguage] || plan.description['en']).map((feature, idx) => (
                                    <View key={idx} className="flex-row items-center">
                                        <Ionicons name="checkmark-circle" size={20} color="#4caf50" className="mr-2" />
                                        <Text className="text-on-surface-variant font-medium ml-2">{feature}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View
                            className={`py-4 rounded-2xl items-center justify-center ${selectedPlanId === plan._id ? 'bg-primary' : 'bg-surface-container-highest'
                                }`}
                        >
                            <Text className={`font-bold text-lg ${selectedPlanId === plan._id ? 'text-white' : 'text-on-surface-variant'
                                }`}>
                                {plan.amount === 0
                                    ? t('subscription.currentPlan')
                                    : t('subscription.subscribeNow')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {error && (
                    <View className="p-4 bg-error-container rounded-2xl items-center">
                        <Text className="text-error font-bold">{t('subscription.error')}</Text>
                    </View>
                )}
            </ScrollView>

            <View className="px-6 py-6 border-t border-outline-variant/10 bg-white">
                <TouchableOpacity
                    disabled={!selectedPlanId || plans?.find(p => p._id === selectedPlanId)?.amount === 0}
                    className={`h-16 rounded-3xl items-center justify-center shadow-lg ${!selectedPlanId || plans?.find(p => p._id === selectedPlanId)?.amount === 0
                        ? 'bg-gray-300 shadow-none'
                        : 'bg-primary shadow-primary/40'
                        }`}
                >
                    <Text className="text-white text-xl font-extrabold uppercase tracking-widest">
                        {t('subscription.proceedToPayment')}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Subscription;
