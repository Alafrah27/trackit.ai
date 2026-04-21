import { View, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const Mic = () => {
    const router = useRouter()
    return (
        <TouchableOpacity
            onPress={() => router.push('/record/recording')}
            activeOpacity={0.8}
            className="absolute bottom-8 right-6 w-16 h-16 rounded-full bg-primary shadow-2xl shadow-primary/50 items-center justify-center z-50"
            style={{ elevation: 10, zIndex: 50 }}
        >
            <Ionicons name="mic" size={32} color="white" />
        </TouchableOpacity>
    )
}

export default Mic