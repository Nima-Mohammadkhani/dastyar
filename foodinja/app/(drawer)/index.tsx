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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView, MotiImage } from "moti";
import DrawerButton from "@/components/ui/DrawerButton";

const MOCK_RESPONSES = [
  "سلام! چه خوشحالم که می‌خوای یه غذای خوشمزه بپزی. برای شروع، چه نوع غذایی دوست داری؟ ایرانی، فرنگی یا شاید یه دسر؟",
  "عالیه! برای قورمه سبزی، اول باید سبزی‌های تازه بخری. سبزی قورمه، تره، گشنیز و جعفری. حدود ۵۰۰ گرم سبزی برای ۴ نفر کافیه.",
  "حالا بذار مراحل پخت رو برات توضیح بدم:\n\n۱. اول سبزی‌ها رو خوب بشور و خرد کن\n۲. گوشت رو با پیاز تفت بده تا طلایی بشه\n۳. سبزی‌ها رو اضافه کن و تفت بده\n۴. لیمو عمانی و رب رو اضافه کن\n۵. آب بریز و بذار بپزه\n\nآتیش ملایم و صبر، راز یه قورمه سبزی خوشمزه است! 🍲",
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

const Index = () => {
  const { backgroundImage, colors } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentTypingText, setCurrentTypingText] = useState("");

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

  const handleSendMessage = () => {
    if (prompt.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: prompt.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    setTimeout(() => {
      const botMessageId = (Date.now() + 1).toString();
      const botResponse =
        MOCK_RESPONSES[messages.length / 2] ||
        "متوجه نشدم، میشه یه چیز دیگه بپرسی؟";

      const botMessage: Message = {
        id: botMessageId,
        text: "",
        isUser: false,
        isTyping: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        typeMessage(botResponse, botMessageId);
      }, 300);
    }, 1000);
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
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Index;
