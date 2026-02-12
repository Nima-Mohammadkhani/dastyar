import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Keyboard,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const [promt, setPromt] = useState<string>("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", (e) => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View className="flex-row justify-between items-center p-4">
          <View className="flex-row gap-2">
            <Button />
            <Button />
          </View>
        </View>

        <View className="px-4 mb-2">
          <Text className="font-vazir text-red-500 text-lg">چی بپزیم!</Text>
        </View>

        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 100,
            }}
          ></ScrollView>
        </Pressable>
        <View
          style={{ bottom: keyboardHeight }}
          className="absolute left-0 right-0 px-4 pt-2 bg-white border-t border-[#eee]"
        >
          <View className={Platform.OS === "ios" ? "pb-5" : "pb-3"}>
            <Input
              value={promt}
              onChangeText={setPromt}
              placeholder="پیامتو بنویس..."
              containerClassName="mb-0"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
