import { View, Image, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },

          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 18,
            color: "white",
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          separator: {
            height: 1,
          },
          row: {
            padding: 10,
            backgroundColor: "transparent",

            borderRadius: 10,
          },

          listView: {
            backgroundColor: "black",
            color: "white",
            borderRadius: 10,
            marginTop: 4,
          },
          poweredContainer: {
            display: "none",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            color: "white", // Customize background color
          },
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
          components: "country:gr",
        }}
        renderRow={(data) => (
          <View>
            <Text className="text-lime-400">{data.description}</Text>
          </View>
        )}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6 ">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "#fdfdfd",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
