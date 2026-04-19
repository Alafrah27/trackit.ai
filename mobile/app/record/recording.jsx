import { ExpoSpeechRecognitionModule as SpeechRecognition, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useVoiceStore } from '../../store/useVoiceStore';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    withSequence,
    Easing,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';

// --- SOUND WAVE COMPONENT ---
const WaveBar = ({ delay, active }) => {
    const height = useSharedValue(12);

    useEffect(() => {
        if (active) {
            height.value = withDelay(
                delay,
                withRepeat(
                    withSequence(
                        withTiming(Math.random() * 40 + 30, { duration: 300 + Math.random() * 200 }),
                        withTiming(12, { duration: 300 })
                    ),
                    -1,
                    true
                )
            );
        } else {
            height.value = withTiming(12, { duration: 300 });
        }
    }, [active]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: height.value
    }));

    return (
        <Animated.View
            style={[animatedStyle, { width: 6, backgroundColor: '#005bc1', borderRadius: 4, marginHorizontal: 3 }]}
        />
    );
};

// --- MAIN RECORD SCREEN ---
const Recording = () => {
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const sendVoiceText = useVoiceStore(state => state.sendVoiceText);

    const [isRecording, setIsRecording] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [transcript, setTranscript] = useState("");

    // 1. Auto-start recording on screen enter
    useEffect(() => {
        const startTimer = setTimeout(() => {
            startListening();
        }, 800); // Slight delay for smooth transition

        return () => {
            SpeechRecognition.stop(); // Cleanup on leave
            clearTimeout(startTimer)
        }
    }, []);

    // 2. Speech Recognition Events
    useSpeechRecognitionEvent("start", () => setIsRecording(true));
    useSpeechRecognitionEvent("end", () => {
        setIsRecording(false);
        if (!isSaving) {
            setTimeout(() => {
                if (!transcript.trim()) {
                    startListening();
                }
            }, 500);
        }
    });
    useSpeechRecognitionEvent("result", (event) => {
        const newText = event.results[0]?.transcript || "";
        setTranscript(newText)
    });
    useSpeechRecognitionEvent("error", (event) => {
        console.log("Recognition Error:", event.error);
        setIsRecording(false);
    });

    const startListening = async () => {
        try {
            const { granted } = await SpeechRecognition.requestPermissionsAsync();
            if (!granted) {
                Toast.show({
                    type: 'error',
                    text1: 'Permission Denied',
                    text2: 'Microphone access is required.',
                    position: 'top',
                });
                return;
            }
            setTranscript("");
            setIsRecording(true); // Optimistic UI update
            SpeechRecognition.start({
                lang: "ar-SA",
                interimResults: true,
                continuous: true,

            });
        } catch (error) {
            console.error("Speech Start Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Microphone Error',
                text2: error?.message || "Failed to start recording.",
                position: 'top',
            });
            setIsRecording(false);
        }
    };

    // 3. Stop & Save to MongoDB via Express
    const handleStopAndSave = async () => {
        SpeechRecognition.stop();

        if (!transcript.trim()) {
            Toast.show({
                type: 'info',
                text1: 'No Input',
                text2: 'Please speak your expense before stopping.',
                position: 'top',
            });
            setIsRecording(false);
            return;
        }

        setIsSaving(true);
        try {
            const result = await sendVoiceText(transcript);

            if (result.success) {
                if (result.type === "question") {
                    // Wait for TTS to finish speaking before re-enabling mic
                    setTimeout(() => {
                        startListening();
                    }, 3500);
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: result.speak,
                        position: 'top',
                    });
                    setTimeout(() => router.back(), 1500);
                }
            } else {
                Alert.alert("Error", result.message || "Failed to process voice command");
            }
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Save Error',
                text2: 'Could not reach the server.',
                position: 'top',
            });
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
                <Text className="text-lg font-bold text-on-surface capitalize">{name || 'Recording'}</Text>
                <View className="w-10 h-10" />
            </View>

            {/* Animation & Mic Area */}
            <View className="flex-1 items-center justify-center w-full">
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={startListening}
                    className="relative items-center justify-center w-64 h-64 mb-6"
                >
                    <View
                        className={`w-40 h-40 rounded-full items-center justify-center z-10 shadow-lg ${isRecording ? 'bg-[#005bc1]/10' : 'bg-gray-100'}`}
                    >
                        <View
                            className={`w-32 h-32 rounded-full items-center justify-center z-10 shadow-xl ${isRecording ? 'bg-[#005bc1]' : 'bg-gray-300'}`}
                            style={{ elevation: 12 }}
                        >
                            <Ionicons name={isSaving ? "sync" : "mic"} size={56} color="white" />
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Animated Sound Waves */}
                <View className="flex-row items-center justify-center h-16 w-full mb-4">
                    {[0, 100, 200, 150, 50, 250, 100].map((delay, index) => (
                        <WaveBar key={index} delay={delay} active={isRecording} />
                    ))}
                </View>

                <Text className="text-2xl font-extrabold text-on-surface text-center px-6 mb-2">
                    {isSaving ? "AI is Parsing..." : isRecording ? "Listening..." : "Ready"}
                </Text>

                {/* Animated Live Transcript Display */}
                <View className="mt-2 px-8 h-28 items-center justify-center w-full">
                    {transcript ? (
                        <Animated.Text
                            entering={FadeIn.duration(400)}
                            className="text-2xl text-on-surface font-semibold text-center italic leading-8"
                        >
                            "{transcript}"
                        </Animated.Text>
                    ) : (
                        <Animated.Text
                            entering={FadeIn.duration(400)}
                            exiting={FadeOut.duration(200)}
                            className="text-lg text-on-surface-variant text-center opacity-60"
                        >
                            Waiting for voice input...
                        </Animated.Text>
                    )}
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