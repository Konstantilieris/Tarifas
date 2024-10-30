import { Text, View, Image, Alert } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { useOAuth } from "@clerk/clerk-expo";
import React from "react";

import { googleOAuth } from "@/lib/auth";
import { router } from "expo-router";
const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const handleGoogleSignIn = React.useCallback(async () => {
    try {
      const result = await googleOAuth(startOAuthFlow);
      if (result.code === "success" || result.code === "session_exists") {
        Alert.alert(
          "Success",
          "You have successfully signed in with Google.Redirecting you to the home page"
        );
        router.push("/(root)/(tabs)/home");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg text-purple-400">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>
      <CustomButton
        title="Log In with Google"
        bgVariant="outline"
        className="mt-4"
        onPress={handleGoogleSignIn}
        IconLeft={() => (
          <Image
            source={icons.google}
            className="w-6 h-6  mr-2"
            resizeMode="contain"
          />
        )}
      />
    </View>
  );
};

export default OAuth;
