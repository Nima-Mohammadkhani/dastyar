import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useTheme } from "@/constants/theme";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Keyboard,
  Pressable,
  ImageBackground,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { TextInput } from "react-native-gesture-handler";
const Index = () => {
  const { backgroundImage, colors } = useTheme();
  const [promt, setPromt] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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
        <View style={{ flex: 1 }}>
          <Pressable
            className="flex-1 flex flex-col justify-center items-center gap-2"
            onPress={Keyboard.dismiss}
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
            <Text className="font-vazir" style={{ color: colors.neutral[50] }}>
              بذار کمکت کنم تا یه غذای لذیذ بپزی...
            </Text>
          </Pressable>

          <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            ></ScrollView>
          </Pressable>
          <View className="relative" style={{ bottom: keyboardHeight }}>
            <Input
              value={promt}
              onChangeText={setPromt}
              placeholder="پیامتو بنویس..."
              placeholderTextColor={colors.primary[900]}
              containerClassName="p-2 text-base rounded-2xl bg-white/50"
              containerStyle={{
                borderWidth: 4,
                borderColor: colors.primary[900],
              }}
              inputStyle={{
                color: colors.primary[900],
                fontFamily: "vazir",
              }}
            />
            <Button
              className="absolute w-12 h-12 top-2.5 start-2 px-2 rounded-full"
              style={{
                backgroundColor: colors.primary[900],
              }}
              iconRight="send"
              iconClassName="mr-1"
              iconRotate={220}
              iconCenter={true}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Index;
