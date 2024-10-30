import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  KeyboardType,
} from "react-native";

interface InputFieldProps {
  label: string;
  labelStyle?: string;
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardType;

  autoCorrect?: boolean;
  icon?: any;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  autoComplete?:
    | "additional-name"
    | "address-line1"
    | "address-line2"
    | "birthdate-day"
    | "birthdate-full"
    | "birthdate-month"
    | "birthdate-year"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-day"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-number"
    | "cc-name"
    | "cc-given-name"
    | "cc-middle-name"
    | "cc-family-name"
    | "cc-type"
    | "country"
    | "current-password"
    | "email"
    | "family-name"
    | "gender"
    | "given-name"
    | "honorific-prefix"
    | "honorific-suffix"
    | "name"
    | "name-family"
    | "name-given"
    | "name-middle"
    | "name-middle-initial"
    | "name-prefix"
    | "name-suffix"
    | "new-password"
    | "nickname"
    | "one-time-code"
    | "organization"
    | "organization-title"
    | "password"
    | "password-new"
    | "postal-address"
    | "postal-address-country"
    | "postal-address-extended"
    | "postal-address-extended-postal-code"
    | "postal-address-locality"
    | "postal-address-region"
    | "postal-code"
    | "street-address"
    | "sms-otp"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-device"
    | "url"
    | "username"
    | "username-new"
    | "off"
    | undefined;
}
const InputField = ({
  label,
  labelStyle,
  containerStyle,
  placeholder,
  onChangeText,
  value,
  className,
  icon,
  iconStyle,
  inputStyle,
  secureTextEntry = false,
  autoCorrect = false,
  autoComplete = "off",
  keyboardType = "default",
  ...props
}: InputFieldProps) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="my-2 w-full">
        <Text
          className={`text-lg font-JakartaSemiBold text-purple-200 ml-2 ${labelStyle}`}
        >
          {label}
        </Text>
        <View
          className={`flex flex-row justify-start items-center bg-neutral-600 rounded-full border border-neutral-600 focus:border-primary-100 relative ${containerStyle}`}
        >
          {icon && (
            <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle} `} />
          )}
          <TextInput
            className={`rounded-full p-4 font-JakartaSemiBold text-purple-200 w-full text-[15px] ${inputStyle}`}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            placeholder={placeholder}
            value={value}
            onChangeText={(value) => onChangeText(value)}
            autoComplete={autoComplete}
            autoCorrect={autoCorrect}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default InputField;
