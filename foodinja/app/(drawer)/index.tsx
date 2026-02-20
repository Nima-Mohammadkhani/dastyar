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
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import DrawerButton from "@/components/ui/DrawerButton";
import BottomSheet from "@/components/ui/BottomSheet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useSendChatMessageMutation,
} from "@/redux/service/app";
import type { ChatMessage } from "@/types/api";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

const Index = () => {
  const { backgroundImage, colors, isDark } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [loginSheet, setLoginSheet] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const router = useRouter();
  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [sendChatMessage, { isLoading: isSending }] = useSendChatMessageMutation();

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
    if (prompt.trim() === "" || isLoading || isSending) return;

    if (!isAuthenticated) {
      setLoginSheet(true);
      return;
    }

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

      if (result.conversation_id && !conversationId) {
        setConversationId(result.conversation_id);
      }

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

  const showWelcomeScreen = messages.length === 0;

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
        <DrawerButton setLoginSheet={setLoginSheet} />
        <View style={{ flex: 1 }}>
          {showWelcomeScreen ? (
            <Pressable className="flex-1" onPress={Keyboard.dismiss}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: "timing", duration: 700 }}
                className={`flex-1 flex flex-col justify-center items-center gap-2 ${keyboardHeight !== 0 ? "mb-80" : "mb-0"}`}
              >
                <Image
                  source={require("@/assets/images/logo/logo.png")}
                  className="size-24"
                />
                <Text
                  className="font-vazir text-lg"
                  style={{ color: colors.neutral[50] }}
                >
                  من فودینجا هستم
                </Text>
                <Text
                  className="font-vazir"
                  style={{ color: colors.neutral[50] }}
                >
                  بذار کمکت کنم تا یه غذای لذیذ بپزی...
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
                        <Image
                          source={require("@/assets/images/logo/logo.png")}
                          className="size-8"
                        />
                        <Text
                          className="font-vazir text-sm"
                          style={{ color: colors.neutral[50] }}
                        >
                          فودینجا
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
              editable={!isLoading}
              onSubmitEditing={handleSendMessage}
            />
            <Button
              className="absolute w-12 h-12 top-1.5 start-2 px-2 rounded-full"
              style={{
                backgroundColor: isLoading
                  ? colors.neutral[400]
                  : colors.primary[900],
              }}
              iconRight={isLoading ? "pause" : "send"}
              iconClassName="mr-1"
              iconRotate={isLoading ? 0 : 220}
              iconCenter={true}
              onPress={handleSendMessage}
              disabled={isLoading || prompt.trim() === ""}
            />
          </MotiView>
        </View>

        <BottomSheet visible={loginSheet} onClose={() => setLoginSheet(false)}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 20 }}
            transition={{ type: "timing", duration: 400 }}
            className="p-6"
          >
            <View className="flex-row justify-between items-center mb-4">
              <View style={{ width: 24 }} />
              <Pressable onPress={() => setLoginSheet(false)}>
                <Ionicons name="close" size={24} color={colors.neutral[400]} />
              </Pressable>
            </View>

            <View className="items-center gap-2 mb-6">
              <Image
                source={require("@/assets/images/logo/logo.png")}
                className="w-20 h-20"
              />
              <Text
                className="font-vazir text-xl"
                style={{ color: colors.neutral[50] }}
              >
                به فودینجا خوش آمدید
              </Text>
              <Text
                className="font-vazir text-lg text-center"
                style={{ color: colors.neutral[50] }}
              >
                وارد شوید یا یک حساب کاربری ایجاد کنید
              </Text>
            </View>

            <View
              className="bg-primary-50 rounded-md p-4 mb-6"
              style={{ backgroundColor: colors.primary[900] + "10" }}
            >
              <Text
                className="font-vazir text-sm text-center"
                style={{ color: colors.neutral[400], lineHeight: 22 }}
              >
                با مدل‌های هوشمندتر کار کنید، شخصی‌سازی کنید و چت‌های خود را
                ذخیره کنید
              </Text>
            </View>

            <Pressable
              onPress={() => {
                router.push("/auth/login");
                setLoginSheet(false);
              }}
              className="mb-3"
            >
              <View
                className="flex-row-reverse items-center justify-between p-4 rounded-md"
                style={{
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Image
                    source={require("@/assets/images/logo/google.png")}
                    className="w-6 h-6"
                  />
                  <Text
                    className="font-vazir text-base"
                    style={{ color: colors.neutral[50] }}
                  >
                    ادامه با گوگل
                  </Text>
                </View>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push("/auth/login");
                setLoginSheet(false);
              }}
              className="mb-3"
            >
              <View
                className="flex-row-reverse items-center justify-between p-4 rounded-md"
                style={{
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  ثبت نام
                </Text>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                router.push("/auth/login");
                setLoginSheet(false);
              }}
            >
              <View
                className="flex-row-reverse items-center justify-between p-4 rounded-md"
                style={{
                  backgroundColor: cardBg,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  ورود
                </Text>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </Pressable>

            <Text
              className="font-vazir text-xs text-center mt-6"
              style={{ color: colors.neutral[400] }}
            >
              با ادامه، شرایط و قوانین فودینجا را می‌پذیرید
            </Text>
          </MotiView>
        </BottomSheet>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Index;
