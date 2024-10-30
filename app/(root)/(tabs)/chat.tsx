import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Send,
} from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import {
  TouchableOpacity,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { database } from "@/config/firebase";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const { user } = useUser();
  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");

    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc: any) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate(),
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, []);
  const onSend = useCallback((messages: any) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className=" w-full   flex-1 bg-dark-300 ">
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: user?.id!,
            name: user?.emailAddresses[0].emailAddress!.split("@")[0],
          }}
          messagesContainerStyle={{
            backgroundColor: "#151821",
            marginBottom: 20,
          }}
          locale="gr"
          showAvatarForEveryMessage={true}
          renderUsernameOnMessage={true}
          alignTop={!isKeyboardVisible}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: "#444", // Background color for received messages
                },
                right: {
                  backgroundColor: "#a855f7", // Background color for sent messages
                },
              }}
              textStyle={{
                left: {
                  color: "#FFF", // Text color for received messages
                },
                right: {
                  color: "#FFF", // Text color for sent messages
                },
              }}
            />
          )}
          renderSend={(props) => (
            <Send
              {...props}
              containerStyle={{ marginTop: 0, borderTopColor: "white" }}
            >
              <Ionicons
                name="send" // Icon name for the send button
                size={14}
                color="#a855f7"
                style={{ marginBottom: 15 }} // Icon color
              />
            </Send>
          )}
          renderInputToolbar={(props) => (
            <InputToolbar
              {...props}
              // @ts-ignore
              textInputStyle={{
                color: "#FFF", // Set input text color to white
                // Optional: adjust padding for better appearance
              }}
              containerStyle={{
                backgroundColor: "#151821",
                borderColor: "#a855f7", // Border color
                borderWidth: 1,
                borderTopColor: "#a855f7", // Border width
                borderRadius: 20,
                padding: 10,
                marginBottom: isKeyboardVisible ? 0 : 70,
              }}
            />
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Chat;
