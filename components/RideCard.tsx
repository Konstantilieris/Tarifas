import { Ride } from "@/types/type";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { Suspense, useState } from "react";
import { icons } from "@/constants";
import { formatDate, formatTime } from "@/lib/utils";

const RideCard = ({
  ride: {
    destination_longitude,
    destination_address,
    destination_latitude,
    driver_id,
    driver,
    created_at,
    fare_price,
    origin_address,
    origin_latitude,
    origin_longitude,
    payment_status,
    ride_time,
    user_email,
  },
}: {
  ride: Ride;
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <View className="flex flex-row items-center justify-center bg-neutral-700 rounded-lg shadow-sm shadow-purple-300 mb-3 ">
      <View className="flex flex-col items-start justify-center p-3">
        <View className="flex flex-row items-center justify-between">
          {imageLoading && (
            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={{ width: 80, height: 90 }}
            />
          )}
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            className="w-[80px] h-[90px] rounded-lg"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            style={imageLoading ? { opacity: 0 } : { opacity: 1 }}
          />

          <View className="flex flex-col mx-5 gap-y-5 flex-1">
            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.to} className="w-5 h-5" />
              <Text
                className="text-md font-JakartaMedium text-white"
                numberOfLines={1}
              >
                {origin_address}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-x-2">
              <Image source={icons.point} className="w-5 h-5" />
              <Text
                className="text-md font-JakartaMedium text-white"
                numberOfLines={1}
              >
                {destination_address}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col w-full mt-5 bg-neutral-600 rounded-lg p-3 items-start justify-center">
          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-white">
              Date & Time
            </Text>
            <Text
              className="text-md font-JakartaBold text-white"
              numberOfLines={1}
            >
              {formatDate(created_at)}, {formatTime(ride_time)}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-white">
              Driver
            </Text>
            <Text className="text-md font-JakartaBold text-white">
              {driver.first_name} {driver.last_name}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between mb-5">
            <Text className="text-md font-JakartaMedium text-white">
              Car Seats
            </Text>
            <Text className="text-md font-JakartaBold text-white">
              {driver.car_seats}
            </Text>
          </View>

          <View className="flex flex-row items-center w-full justify-between">
            <Text className="text-md font-JakartaMedium text-white">
              Payment Status
            </Text>
            <Text
              className={`text-md capitalize font-JakartaBold ${payment_status === "paid" ? "text-green-500" : "text-red-500"}`}
            >
              {payment_status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default RideCard;
