import GoogleTextInput from "@/components/GoogleTextInput";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";

import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import { useFetch } from "@/lib/fetch";
import { Ride } from "@/types/type";

const Home = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();

  const { signOut } = useAuth();

  const [hasPermission, setHasPermission] = useState(false);
  const { data: recentRides, loading } = useFetch<Ride[]>(
    `/(api)/ride/${user?.id}`
  );
  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };
  const handleDestinationPress = ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation({ latitude, longitude, address });
    router.push("/(root)/find-ride");
  };
  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }
      setHasPermission(true);
      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name},${address[0].region} `,
      });
    };
    requestLocation();
  }, []);

  return (
    <SafeAreaView className="bg-black w-full h-full items-start py-8 px-4 relative">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        className="px-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="flex items-center justify-center w-full h-full">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-lg text-white">
                  No recent rides found
                </Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#fff" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row justify-between my-4 items-center">
              <Text
                className="text-xl font-JakartaExtraBold text-purple-400 text-center capitalize"
                numberOfLines={1}
              >
                Welcome {user?.fullName}
              </Text>
              <TouchableOpacity
                className="bg-slate-300 rounded-full justify-center items-center w-10 h-10"
                onPress={handleSignOut}
              >
                <Image source={icons.out} className="w-6 h-6" />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle={"bg-dark-300 shadow-md shadow-neutral-800 "}
              handlePress={handleDestinationPress}
              textInputBackgroundColor="transparent"
            />
            <>
              <Text className="text-xl font-JakartaBold mt-5 mb-3 text-lime-500">
                Your Current Location
              </Text>
              <View className="flex flex-row items-center bg-transparent h-[300px]">
                <Map />
              </View>
            </>
            <Text className="text-xl font-JakartaBold mt-5 mb-3 text-purple-400">
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
