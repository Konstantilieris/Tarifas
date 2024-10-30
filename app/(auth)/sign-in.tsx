import { View, Text, ScrollView, Image, Alert } from "react-native";
import InputField from "@/components/InputField";
import { images, icons } from "@/constants";
import React, { useCallback } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";
const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form.email, form.password]);
  return (
    <ScrollView className="flex-1  bg-neutral-900">
      <View className="flex-1 ">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-yellow-300 font-JakartaSemiBold absolute bottom-5 left-5 ">
            Welcome Back
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter Your Name"
            icon={icons.email}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <InputField
            label="Password"
            placeholder="Enter Your Name"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
          <CustomButton
            title="LogIn"
            onPress={onSignInPress}
            className="mt-6"
          />
          <OAuth />
          <Link href={"/sign-up"} className="mt-4 ml-2">
            <Text className=" text-purple-200 font-">
              Dont have an account?
            </Text>
            <Text className=" text-purple-400 font-JakartaSemiBold">
              {" "}
              Sign Up
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
