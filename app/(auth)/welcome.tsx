import { View, Text, TouchableOpacity, Image } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { useRef, useState } from "react";
import { onboarding } from "@/constants";
import CustomButton from "@/components/CustomButton";
const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  return (
    <SafeAreaView className="flex h-full items-center justify-between w-full bg-neutral-900 ">
      <TouchableOpacity
        className="w-full flex items-end justify-end p-5 rounded-lg"
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
      >
        <Text className="text-white text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-purple-900 rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-purple-500 rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View
            className="flex items-start justify-center w-full py-5 px-2 mt-2 "
            key={item.id}
          >
            <View>
              <Text className="text-2xl text-purple-200 font-JakartaBold text-center">
                {item.title}
              </Text>
            </View>
            <Image
              source={item.image}
              className="w-full h-[50vh] rounded-[600px]"
              resizeMode="contain"
            />

            <View>
              <Text className="text-md text-purple-200 font-JakartaSemiBold text-center mt-4 px-12">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={
          isLastSlide
            ? () => router.replace("/(auth)/sign-up")
            : () => swiperRef.current?.scrollBy(1)
        }
      />
    </SafeAreaView>
  );
};

export default Onboarding;
