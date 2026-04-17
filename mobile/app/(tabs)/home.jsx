import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ThmedSafeArea from '../../components/ThmedSafeArea';

const Actions = [
    {
        id: 1,
        name: "Add Expense",
        icon: "cash",

    },
    {
        id: 2,
        name: "Add Reminder",
        icon: "alarm",

    }
]
const Home = () => {
    const [selectedId, setSelectedId] = useState(null);
    const router = useRouter();

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
        <ThmedSafeArea>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            >
                {/* Help Greeting Section */}
                <View className="items-center mt-10 mb-12">
                    <Text className="text-2xl md:text-4xl font-semibold tracking-tight text-on-surface text-center">How Can I Help You Today?</Text>
                    <Text className="text-on-surface-variant text-lg mt-2 text-center">Tap the mic to start speaking</Text>
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
        </ThmedSafeArea>
    );
};


export default Home;
