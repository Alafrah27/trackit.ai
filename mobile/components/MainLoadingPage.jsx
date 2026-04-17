import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text } from "react-native";

export default function MainLoadingPage() {
    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#005bc1]">
            <Image source={require("../assets/images/icon.png")} className="w-24 h-24" />
        </SafeAreaView>
    )
}