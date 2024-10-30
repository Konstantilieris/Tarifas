import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

import { useDriverStore, useLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useEffect, useState } from "react";
import { Driver, MarkerData } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { ActivityIndicator, View, Text } from "react-native";

import MapViewDirections from "react-native-maps-directions";
const Map = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });
  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) {
        return;
      }
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);
  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [destinationLatitude, destinationLongitude, markers]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full ">
        <ActivityIndicator size="small" color="black" />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex justify-between items-center w-full  ">
        <Text>Error: {error}</Text>
      </View>
    );
  }
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      region={region}
      className="w-full h-full rounded-full"
      tintColor="#84cc16"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      showsUserLocation={true}
      userInterfaceStyle="dark"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          description={`Rating: ${marker.rating}`}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}
      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            description="Your destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{ latitude: userLatitude, longitude: userLongitude }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor="#9333ea"
            strokeWidth={2}
          />
        </>
      )}
    </MapView>
  );
};
export default Map;
