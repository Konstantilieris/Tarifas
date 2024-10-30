import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import InputField from "@/components/InputField";
import { images, icons } from "@/constants";

import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import ReactNativeModal from "react-native-modal";
import OAuth from "@/components/OAuth";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1  bg-neutral-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 ">
          <View className="relative w-full h-[250px]">
            <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
            <Text className="text-2xl text-yellow-300 font-JakartaSemiBold absolute bottom-5 left-5 ">
              Create Your Account
            </Text>
          </View>
          <View className="p-5">
            <InputField
              label="Name"
              placeholder="Enter Your Name"
              icon={icons.person}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <InputField
              label="Email"
              placeholder="Enter Your Email"
              autoComplete="email"
              autoCorrect={true}
              icon={icons.email}
              value={form.email}
              onChangeText={(email) => setForm({ ...form, email })}
            />
            <InputField
              label="Password"
              icon={icons.lock}
              secureTextEntry={true}
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
            <CustomButton
              title="Sign Up"
              onPress={onSignUpPress}
              className="mt-6"
            />
            <OAuth />
            <Link href={"/sign-in"} className="mt-4 ml-2">
              <Text className=" text-purple-200 font-">
                Already have an account?
              </Text>
              <Text className=" text-purple-400 font-JakartaSemiBold">
                {" "}
                Log In
              </Text>
            </Link>
          </View>
          <ReactNativeModal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") setShowSuccessModal(true);
            }}
          >
            <View className="bg-black px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="text-2xl font-JakartaExtraBold mb-2">
                Verification
              </Text>
              <Text className="text-base text-purple-200 font-Jakarta mb-5">
                Enter the verification code sent to your email.
              </Text>
              <InputField
                label="Verification Code"
                icon={icons.lock}
                keyboardType="numeric"
                placeholder="12345"
                value={verification.code}
                onChangeText={(code) =>
                  setVerification({ ...verification, code })
                }
              />
              <CustomButton
                title="Verify"
                onPress={onPressVerify}
                className="mt-5"
              />
              {verification.error && (
                <Text className="text-red-500 text-sm font-JakartaSemiBold">
                  {verification.error}
                </Text>
              )}
            </View>
          </ReactNativeModal>
          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-black px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={images.check}
                className="w-[120px] h-[120px] mx-auto my-5 rounded-2xl"
              />
              <Text className="text-3xl font-JakarataBold text-center text-white">
                Verified
              </Text>
              <Text className="text-base text-purple-200 font-Jakarta text-center">
                You have successfully verified your account.
              </Text>
              <CustomButton
                title="Browse Home"
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push("/(root)/(tabs)/home");
                }}
                className="mt-5"
              />
            </View>
          </ReactNativeModal>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default SignUp;
