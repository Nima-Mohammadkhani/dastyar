import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-row justify-between items-center">
        <View className="rounded-xl">
          <Button />
          <Button />
        </View>
      </View>
      <View className="flex-1 flex flex-col gap-2 justify-center items-center">
        <Text className="font-vazir text-[red]">چی بپزیم!</Text>
        <View className="grid grid-cols-2">
          {/* 4x */}
          <View className="flex flex-row justify-around items-center rounded-2xl p-2"></View>
        </View>
      </View>
      <ScrollView className="flex-1">{/* chat ui */}</ScrollView>
      <Input className="fixed bottom-5 rounded-2xl" />
    </SafeAreaView>
  );
};
export default Index;
