import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');


const OnboardingItem = ({ item, index, scrollX, t }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <View className="bg-primary/10 p-10 rounded-full">
            <MaterialCommunityIcons name={item.icon} size={120} color="#005bc1" />
        </View>
      </Animated.View>
      <View style={styles.textContainer}>
        <Text className="text-3xl font-bold text-on-surface text-center mb-4">
          {t(`onboarding.pages.${item.id}.title`, { defaultValue: item.title })}
        </Text>
        <Text className="text-lg text-on-surface-variant text-center px-6 leading-6">
          {t(`onboarding.pages.${item.id}.description`, { defaultValue: item.description })}
        </Text>
      </View>
    </View>
  );
};

const Index = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const onboardingPages = [
    {
      id: "1",
      title: "Voice Your Expenses",
      description: "Just speak and let AI track your expenses instantly without typing.",
      icon: "microphone",
    },
    {
      id: "2",
      title: "Smart AI Assistant",
      description: "Your personal AI understands your commands and organizes everything for you.",
      icon: "robot-outline",
    },
    {
      id: "3",
      title: "Arabic & English Support",
      description: "Track everything in Arabic or English with powerful voice recognition.",
      icon: "translate",
    },
    {
      id: "4",
      title: "Insights & Reminders",
      description: "Get smart spending insights and never miss your important reminders.",
      icon: "chart-bell-curve-cumulative",
    },
    {
      id: "5",
      title: "All in One Place",
      description: "Manage expenses, reminders, and AI interactions in one powerful app.",
      icon: "view-dashboard-outline",
    },
  ];
  const scrollX = useSharedValue(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingPages.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push('/(auth)/sign-up');
    }
  };

  const handleSkip = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header with Skip Button */}
      <View className="flex-row justify-end px-6 pt-4">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-secondary font-semibold text-lg">{t('common.skip', { defaultValue: 'Skip' })}</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={onboardingPages}
        renderItem={({ item, index }) => (
          <OnboardingItem item={item} index={index} scrollX={scrollX} t={t} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Footer */}
      <View className="pb-12 px-6">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {onboardingPages.map((_, index) => {
            const dotStyle = useAnimatedStyle(() => {
              const dotWidth = interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [10, 30, 10],
                Extrapolation.CLAMP
              );
              const opacity = interpolate(
                scrollX.value,
                [(index - 1) * width, index * width, (index + 1) * width],
                [0.3, 1, 0.3],
                Extrapolation.CLAMP
              );
              return {
                width: withSpring(dotWidth),
                opacity,
              };
            });

            return (
              <Animated.View
                key={index}
                style={[styles.dot, dotStyle]}
                className="bg-primary mx-1"
              />
            );
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-primary h-16 rounded-2xl items-center justify-center shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-xl font-bold">
            {currentIndex === onboardingPages.length - 1 ? t('common.getStarted', { defaultValue: 'Get Started' }) : t('common.next', { defaultValue: 'Next' })}
          </Text>
        </TouchableOpacity>
        
        <View className="items-center mt-6">
            <Text className="text-on-surface-variant/40 font-medium tracking-widest uppercase text-xs">
                {t('onboarding.footer', { defaultValue: 'Built with Intelligence' })}
            </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.4,
    width: '100%',
    paddingHorizontal: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
});

export default Index;