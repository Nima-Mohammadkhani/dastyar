import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useTheme } from "@/constants/theme";
import { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Keyboard,
  Pressable,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import DrawerButton from "@/components/ui/DrawerButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useGetConversationByIdQuery,
  useSendChatMessageMutation,
} from "@/redux/service/app";
import type { ChatMessage } from "@/types/api";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatId = () => {
  const { backgroundImage, colors } = useTheme();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const router = useRouter();
  const conversationId = chatId ? parseInt(chatId, 10) : null;
  
  const [prompt, setPrompt] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentTypingText, setCurrentTypingText] = useState("");

  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    error: conversationError,
  } = useGetConversationByIdQuery(conversationId!, {
    skip: !conversationId,
  });

  const [sendChatMessage, { isLoading: isSending }] = useSendChatMessageMutation();

  useEffect(() => {
    if (conversationData?.messages) {
      const formattedMessages: Message[] = conversationData.messages.map((msg) => ({
        id: msg.id.toString(),
        text: msg.content,
        isUser: msg.role === "user",
      }));
      setMessages(formattedMessages);
    }
  }, [conversationData]);

  useEffect(() => {
    if (conversationError) {
      Alert.alert("خطا", "خطا در بارگذاری مکالمه");
      router.back();
    }
  }, [conversationError, router]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, currentTypingText]);

  const typeMessage = (text: string, messageId: string) => {
    let index = 0;
    const typingSpeed = 30;

    const interval = setInterval(() => {
      if (index < text.length) {
        setCurrentTypingText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isTyping: false, text } : msg,
          ),
        );
        setCurrentTypingText("");
        setIsLoading(false);
      }
    }, typingSpeed);
  };

  const handleSendMessage = async () => {
    if (prompt.trim() === "" || isLoading || isSending || !conversationId) return;

    const userMessageText = prompt.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    const history: ChatMessage[] = messages
      .filter((msg) => !msg.isTyping)
      .map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

    try {
      const result = await sendChatMessage({
        query: userMessageText,
        conversation_id: conversationId,
        history: history.length > 0 ? history : undefined,
      }).unwrap();

      const botMessageId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botMessageId,
        text: "",
        isUser: false,
        isTyping: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        typeMessage(result.response, botMessageId);
      }, 300);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error?.data?.message || error?.message || "خطا در ارسال پیام";
      Alert.alert("خطا", errorMessage);
      
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  const showWelcomeScreen = messages.length === 0 && !isLoadingConversation;

  if (isLoadingConversation) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="repeat"
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "transparent" }}
          className="px-4 justify-center items-center"
        >
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="repeat"
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "transparent" }}
        className="px-4"
      >
        <DrawerButton />
        <View style={{ flex: 1 }}>
          {showWelcomeScreen ? (
            <Pressable className="flex-1" onPress={Keyboard.dismiss}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 700 }}
                className={`flex-1 flex flex-col justify-center items-center gap-2 ${keyboardHeight !== 0 ? "mb-80" : "mb-0"}`}
              >
                <View
                  className="w-24 h-24 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary[900] + "CC" }}
                >
                  <Text className="text-white text-4xl font-vazir">AI</Text>
                </View>
                <Text
                  className="font-vazir text-lg"
                  style={{ color: colors.neutral[50] }}
                >
                  دستیار هوشمند
                </Text>
                <Text
                  className="font-vazir"
                  style={{ color: colors.neutral[50] }}
                >
                  هر سوالی داری بپرس، اینجام تا کمک کنم
                </Text>
              </MotiView>
            </Pressable>
          ) : (
            <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
              <ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingBottom: 100,
                  gap: 16,
                }}
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message) => (
                  <MotiView
                    key={message.id}
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "timing", duration: 350 }}
                    style={{
                      alignSelf: message.isUser ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                    }}
                  >
                    {!message.isUser && (
                      <View className="flex flex-row items-center mb-2 gap-2">
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{ backgroundColor: colors.primary[900] }}
                        >
                          <Text className="text-white text-xs font-vazir">AI</Text>
                        </View>
                        <Text
                          className="font-vazir text-sm"
                          style={{ color: colors.neutral[50] }}
                        >
                          دستیار
                        </Text>
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: message.isUser
                          ? colors.primary[700]
                          : "rgba(255, 255, 255, 0.9)",
                        borderRadius: 16,
                        padding: 12,
                        borderBottomRightRadius: message.isUser ? 4 : 16,
                        borderBottomLeftRadius: message.isUser ? 16 : 4,
                      }}
                    >
                      <Text
                        className="font-vazir text-base"
                        style={{
                          color: message.isUser
                            ? colors.neutral[50]
                            : colors.primary[900],
                          lineHeight: 24,
                        }}
                      >
                        {message.isTyping ? currentTypingText : message.text}
                      </Text>
                    </View>
                  </MotiView>
                ))}
              </ScrollView>
            </Pressable>
          )}

          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 300 }}
            className="relative mb-4"
            style={{ bottom: keyboardHeight }}
          >
            <Input
              value={prompt}
              onChangeText={setPrompt}
              placeholder="پیامتو بنویس..."
              placeholderTextColor={colors.primary[900]}
              containerClassName="p-1 text-base rounded-2xl bg-white/50"
              containerStyle={{
                borderWidth: 4,
                borderColor: colors.primary[900],
              }}
              inputStyle={{
                color: colors.primary[900],
                fontFamily: "vazir",
              }}
              editable={!isLoading && !isSending}
              onSubmitEditing={handleSendMessage}
            />
            <Button
              className="absolute w-12 h-12 top-1.5 start-2 px-2 rounded-full"
              style={{
                backgroundColor: isLoading || isSending
                  ? colors.neutral[400]
                  : colors.primary[900],
              }}
              iconRight={isLoading || isSending ? "pause" : "send"}
              iconClassName="mr-1"
              iconRotate={isLoading || isSending ? 0 : 220}
              iconCenter={true}
              onPress={handleSendMessage}
              disabled={isLoading || isSending || prompt.trim() === "" || !conversationId}
            />
          </MotiView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ChatId;
