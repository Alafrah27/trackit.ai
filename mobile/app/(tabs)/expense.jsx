import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import ThmedSafeArea from '../../components/ThmedSafeArea'
import { Ionicons } from '@expo/vector-icons'

const RECENT_EXPENSES = [
    { id: '1', title: 'Whole Foods Market', date: 'Today, 2:45 PM', amount: '-$64.20', icon: 'cart-outline' },
    { id: '2', title: 'Uber Central', date: 'Yesterday, 10:12 PM', amount: '-$18.50', icon: 'car-outline' },
    { id: '3', title: 'Cloud Storage Premium', date: 'Oct 24, 2023', amount: '-$9.99', icon: 'play-circle-outline' },
    { id: '4', title: 'The Artisan Bistro', date: 'Oct 23, 2023', amount: '-$124.00', icon: 'restaurant-outline' },
    { id: '5', title: 'Global Power Co.', date: 'Oct 22, 2023', amount: '-$82.15', icon: 'flash-outline' },
];

const expense = () => {
    return (
        <ThmedSafeArea style={{ backgroundColor: '#005bc1' }}>
            {/* The root ThmedSafeArea is now painted full blue seamlessly */}

            <ScrollView
                className="flex-1 pt-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* The Floating Expense Card */}
                <View
                    className="bg-surface-container rounded-3xl p-6 shadow-lg border border-outline-variant/5 w-full my-8 z-10"
                    style={{ elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 15 }}
                >
                    <View className="">

                        <Text className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-2">Total Expenses</Text>
                        <Text className="text-5xl font-bold text-on-surface mb-6">$1,240<Text className="text-xl text-on-surface-variant">.00</Text></Text>
                    </View>

                    <View className="flex-row  items-center justify-between min-w-full"
                        style={{ width: '100%' }}
                    >
                        <View >
                            <Text className="text-on-surface-variant text-xs mb-1">Monthly Goal</Text>
                            <Text className="text-on-surface font-semibold">$2,000.00</Text>
                        </View>
                        <View className="h-10 flex justify-end  mx-4" />
                        <TouchableOpacity
                            className="items-center justify-center py-3 rounded-2xl"
                        >
                            <Text className="text-[#005bc1] font-bold text-sm">Scan bill</Text>
                            <Ionicons name="camera" size={20} color="#005bc1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom List Content */}
                <View className="flex-row w-full z-10 px-2 mt-10">
                    <TouchableOpacity className="flex-1 bg-white/15 p-4 flex-col rounded-2xl border border-white/10 mr-2">
                        <Ionicons name="trending-up-outline" size={24} color="white" style={{ marginBottom: 8 }} />
                        <Text className='text-white/80 text-xs mb-1'>Highest Spend</Text>
                        <Text className='text-white font-bold text-lg'>Housing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white/15 p-4 flex-col rounded-2xl border border-white/10 ml-2">
                        <Ionicons name="wallet-outline" size={24} color="white" style={{ marginBottom: 8 }} />
                        <Text className='text-white/80 text-xs mb-1'>Daily Average</Text>
                        <Text className='text-white font-bold text-lg'>$100</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-between mt-6 px-4">
                    <Text className="text-sm font-bold text-white tracking-tight">Recent Activity</Text>
                    <TouchableOpacity className="text-white text-xs font-semibold hover:opacity-70">
                        <Text className='text-sm font-bold text-white tracking-tight'>View Report</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-1 space-y-1 px-2 mb-8 mt-4">
                    {RECENT_EXPENSES.map((item) => (
                        <TouchableOpacity key={item.id} className="flex-row items-center justify-between p-4 rounded-3xl bg-surface-container mt-3">
                            <View className="flex-row items-center gap-4">
                                <View className="w-12 h-12 rounded-full bg-surface  items-center justify-center">
                                    <Ionicons name={item.icon} size={24} color="#005bc1" />
                                </View>
                                <View>
                                    <Text className="text-sm font-bold text-on-surface">{item.title}</Text>
                                    <Text className="text-xs text-on-surface-variant mt-1">{item.date}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-base font-bold text-[#005bc1]">{item.amount}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ThmedSafeArea>
    )
}

export default expense