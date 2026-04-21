import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ThemedSafeArea from '../../components/ThemedSafeArea';

const Home = () => {
    const [selectedId, setSelectedId] = useState(null);
    const router = useRouter();
    const { t } = useTranslation();

    const Actions = [
        {
            id: 1,
            name: t('home.addExpense'),
            icon: "cash",
        },
        {
            id: 2,
            name: t('home.addReminder'),
            icon: "alarm",
        }
    ];

    const selectedAction = Actions.find(a => a.id === selectedId)?.name;

    const handleAddExpenseandReminder = () => {
        if (!selectedId) return;
        router.push({
            pathname: '/record/recording',
            params: {
                id: selectedId,
                name: selectedAction,
            }
        });
    }

    return (
        <ThemedSafeArea>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            >
                {/* Help Greeting Section */}
                <View className="items-center mt-10 mb-12">
                    <Text className="text-2xl md:text-4xl font-semibold tracking-tight text-on-surface text-center">
                        {t('home.header')}
                    </Text>
                    <Text className="text-on-surface-variant text-lg mt-2 text-center">
                        {t('home.subheader')}
                    </Text>
                </View>

                {/* Large Mic Button */}
                <View className="items-center justify-center mb-16">
                    <TouchableOpacity
                        onPress={handleAddExpenseandReminder}
                        className={`w-32 h-32 rounded-full items-center justify-center shadow-xl ${selectedId ? 'bg-primary shadow-primary/40' : 'bg-gray-300'}`}
                        activeOpacity={0.8}
                        disabled={!selectedId}
                    >
                        <Ionicons name="mic" size={48} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Action Cards */}
                <View className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Actions.map((action) => (
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedId(selectedId === action.id ? null : action.id);
                            }}
                            key={action.id}
                            className={`bg-surface-container-low p-5 rounded-[20px] items-center justify-center border ${selectedId === action.id ? 'border-primary border-2' : 'border-outline-variant/10'}`}
                            activeOpacity={0.7}
                        >
                            <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4">
                                <Ionicons name={action.icon} size={32} color="#005bc1" />
                            </View>
                            <Text className="text-on-surface text-xl font-bold">{action.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ThemedSafeArea>
    );
};


export default Home;
