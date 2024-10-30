import { View, Text, TouchableOpacity, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { icons } from "@/constants";
import Map from "@/components/Map";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const RideLayout = ({
  title,
  children,
  snapPoints,
  bottomSheetRef,
}: {
  children: React.ReactNode;
  title: string;
  snapPoints: string[];
  bottomSheetRef?: React.RefObject<BottomSheet>;
}) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-black">
        <View className="flex flex-col h-screen bg-purple-500">
          <View className="flex flex-row absolute z-10 top-16 items-center justify-between w-full px-5">
            <TouchableOpacity onPress={() => router.back()}>
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
                <Image
                  source={icons.backArrow}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-JakartaSemiBold ml-5 text-purple-400 self-center">
              {title || "Go Back"}
            </Text>
          </View>
          <Map />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={{ backgroundColor: "#302c2c" }}
        >
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};
export default RideLayout;
