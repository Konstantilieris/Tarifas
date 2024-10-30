import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants";
import { formatTime } from "@/lib/utils";
import { DriverCardProps } from "@/types/type";
const DriverCard = ({ item, selected, setSelected }: DriverCardProps) => {
  return (
    <TouchableOpacity
      onPress={setSelected}
      className={`${
        selected === item.id
          ? "bg-dark-400 border-purple-500"
          : "bg-dark-100 border-dark-100"
      } flex flex-row items-center justify-between py-5 px-3 rounded-xl border`}
    >
      <Image
        source={{ uri: item.profile_image_url }}
        className="w-14 h-14 rounded-full"
      />

      <View className="flex-1 flex flex-col items-start justify-center mx-3">
        <View className="flex flex-row items-center justify-start mb-1">
          <Text className="text-lg font-JakartaRegular text-light-900">
            {item.title}
          </Text>

          <View className="flex flex-row items-center space-x-1 ml-2">
            <Image source={icons.star} className="w-3.5 h-3.5" />
            <Text className="text-sm font-JakartaRegular text-lime-300">4</Text>
          </View>
        </View>

        <View className="flex flex-row items-center justify-start">
          <View className="flex flex-row items-center">
            <Text className="text-sm font-JakartaRegular ml-1 text-lime-400">
              €{item.price}
            </Text>
          </View>

          <Text className="text-sm font-JakartaRegular text-light-900 mx-1">
            |
          </Text>

          <Text className="text-sm font-JakartaRegular text-light-900">
            {formatTime(parseInt(`${item.time}`) || 5)}
          </Text>

          <Text className="text-sm font-JakartaRegular text-light-900mx-1">
            |
          </Text>

          <Text className="text-sm font-JakartaRegular text-light-900">
            {item.car_seats} seats
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: item.car_image_url }}
        className="h-14 w-14"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};
export default DriverCard;
