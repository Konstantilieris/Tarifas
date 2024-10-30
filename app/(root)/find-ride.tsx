import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { View, Text, Keyboard } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  const [snapPoints] = useState(["45%", "85%"]); // Define snap points
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    // Listener for keyboard show
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        bottomSheetRef.current?.snapToIndex(1); // Snap to 85%
      }
    );

    // Listener for keyboard hide
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        bottomSheetRef.current?.snapToIndex(0); // Snap back to 45%
      }
    );

    // Clean up listeners on component unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <RideLayout
      title="Ride"
      snapPoints={snapPoints}
      bottomSheetRef={bottomSheetRef}
    >
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3 text-purple-500">
          From
        </Text>
        <GoogleTextInput
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle="bg-dark-200"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setUserLocation(location)}
        />
      </View>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3 text-purple-500">
          To
        </Text>
        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle="bg-dark-200"
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
        />
      </View>
      <CustomButton
        title="Find Now"
        onPress={() => router.push("/(root)/confirm-ride")}
        className="mt-5"
      />
    </RideLayout>
  );
};

export default FindRide;
