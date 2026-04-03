import { SpeechRecognition, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { View, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

// --- PULSE RING COMPONENT (UI ONLY) ---
const PulseRing = ({ delay, active }) => {
    const ring = useSharedValue(0);

    useEffect(() => {
        if (active) {
            ring.value = withDelay(
                delay,
                withRepeat(
                    withTiming(1, { duration: 2500, easing: Easing.out(Easing.ease) }),
                    -1,
                    false
                )
            );
        } else {
            ring.value = 0;
        }
    }, [active, delay]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: 0.8 - ring.value * 0.8,
        transform: [{ scale: 1 + ring.value * 2.5 }],
    }));

    return (
        <Animated.View
            className="absolute bg-primary"
            style={[{ width: 140, height: 140, borderRadius: 70 }, animatedStyle]}
        />
    );
};

// --- MAIN RECORD SCREEN ---
const Recording = () => {
    const router = useRouter();
    const { section } = useLocalSearchParams();
    const insets = useSafeAreaInsets();

    const [isRecording, setIsRecording] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [transcript, setTranscript] = useState("");

    // 1. Auto-start recording on screen enter
    useEffect(() => {
        const startTimer = setTimeout(() => {
            startListening();
        }, 800); // Slight delay for smooth transition

        return () => SpeechRecognition.stop(); // Cleanup on leave
    }, []);

    // 2. Speech Recognition Events
    useSpeechRecognitionEvent("start", () => setIsRecording(true));
    useSpeechRecognitionEvent("end", () => setIsRecording(false));
    useSpeechRecognitionEvent("result", (event) => {
        setTranscript(event.results[0]?.transcript || "");
    });
    useSpeechRecognitionEvent("error", (event) => {
        console.log("Recognition Error:", event.error);
        setIsRecording(false);
    });

    const startListening = async () => {
        const { granted } = await SpeechRecognition.requestPermissionsAsync();
        if (!granted) {
            Alert.alert("Permission Denied", "Microphone access is required.");
            return;
        }
        setTranscript("");
        SpeechRecognition.start({ lang: "en-US", interimResults: true });
    };

    // 3. Stop & Save to MongoDB via Express
    const handleStopAndSave = async () => {
        SpeechRecognition.stop();

        if (!transcript.trim()) {
            Alert.alert("No Input", "Please speak your expense before stopping.");
            return;
        }

        setIsSaving(true);
        try {
            // IMPORTANT: Replace '192.168.1.XX' with your laptop's local IP address
            const response = await fetch('http://192.168.1.XX:3000/api/voice-expense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transcript: transcript,
                    category: section || "General"
                }),
            });

            if (response.ok) {
                router.replace('/home'); // Success!
            } else {
                throw new Error("Server failed to save");
            }
        } catch (err) {
            Alert.alert("Save Error", "Could not reach the server. Check your IP/Network.");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-surface">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
                    <Ionicons name="close" size={24} color="#2d3435" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-on-surface capitalize">{section || 'Recording'}</Text>
                <View className="w-10 h-10" />
            </View>

            {/* Animation & Mic Area */}
            <View className="flex-1 items-center justify-center w-full">
                <View className="relative items-center justify-center w-64 h-64 mb-10">
                    <PulseRing delay={0} active={isRecording} />
                    <PulseRing delay={800} active={isRecording} />
                    <PulseRing delay={1600} active={isRecording} />

                    <View
                        className={`w-36 h-36 rounded-full items-center justify-center z-10 shadow-lg ${isRecording ? 'bg-primary' : 'bg-gray-300'}`}
                        style={{ elevation: 10 }}
                    >
                        <Ionicons name={isSaving ? "sync" : "mic"} size={60} color="white" />
                    </View>
                </View>

                <Text className="text-3xl font-extrabold text-on-surface text-center px-6">
                    {isSaving ? "AI is Parsing..." : isRecording ? "Listening..." : "Ready"}
                </Text>

                {/* Live Transcript Display */}
                <View className="mt-6 px-10 h-24">
                    <Text className="text-lg text-on-surface-variant text-center italic leading-6">
                        {transcript || "Say something like: 'Spent $20 on lunch'"}
                    </Text>
                </View>
            </View>

            {/* Final Stop Button (Fixed Padding/Color) */}
            <View style={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 20) + 10 }}>
                <TouchableOpacity
                    onPress={handleStopAndSave}
                    disabled={isSaving}
                    activeOpacity={0.8}
                    style={[styles.stopButton, { backgroundColor: isSaving ? '#9ca3af' : '#dc160f' }]}
                >
                    <Ionicons name={isSaving ? "cloud-upload" : "stop"} size={24} color="white" />
                    <Text className="text-white text-xl font-bold">
                        {isSaving ? "Saving to Database..." : "Stop Recording"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    stopButton: {
        height: 64,
        width: '100%',
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }
});

export default Recording;