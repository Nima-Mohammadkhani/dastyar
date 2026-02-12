import { useDrawerStatus } from "@react-navigation/drawer";
import { View, Text, ScrollView } from "react-native";
import Input from "./ui/Input";
import { useState, useEffect } from "react";
import { useTheme } from "@/constants/theme";
import Button from "./ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomDrawerContent = () => {
  const [search, setSearch] = useState<string>("");
  const { colors } = useTheme();
  const drawerStatus = useDrawerStatus();
  const isDrawerOpen = drawerStatus === "open";
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    if (isDrawerOpen) {
      setAnimateKey((prev) => prev + 1);
    }
  }, [isDrawerOpen]);

  const history = [
    { id: 1, title: "طرز تهیه قرمه سبزی" },
    { id: 2, title: "چطوری قیمه درست کنم؟" },
    { id: 3, title: "میخوام زرشک پلو با مرغ درست کنم چطوری؟" },
    { id: 4, title: "بهم فستجون یاد بده بپزم" },
    { id: 5, title: "چطوری دوپیازه درست کنم؟" },
    { id: 6, title: "چطوری دلمه درست کنم و چند نوع داره؟" },
    { id: 7, title: "میخوام املت درست کنم راهنمایی ام کن" },
    { id: 8, title: "مواد اولیه برای پخت پیتزا چی هست؟" },
    { id: 9, title: "میخوام مرغ ترش درست کنم راهنمایی ام کن" },
    { id: 10, title: "چند تا تخم مرغ برای کوکو سبزی نیاز هست؟" },
    { id: 11, title: "میخوام املت درست کنم راهنمایی ام کن" },
    { id: 12, title: "مواد اولیه برای پخت پیتزا چی هست؟" },
    { id: 13, title: "میخوام مرغ ترش درست کنم راهنمایی ام کن" },
    { id: 14, title: "چند تا تخم مرغ برای کوکو سبزی نیاز هست؟" },
    { id: 15, title: "چند تا تخم مرغ برای کوکو سبزی نیاز هست؟" },
  ];

  const filterHistory = history.filter((item) =>
    item.title.toLowerCase().includes(search.toLocaleLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      <MotiView
        key={`top-${animateKey}`}
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350 }}
      >
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center gap-2">
            <View className="flex-1 relative">
              <Input
                value={search}
                onChangeText={setSearch}
                placeholder="جستجو..."
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
              />
              <Button
                className="absolute w-12 h-12 start-2 top-1.5 rounded-full"
                style={{ backgroundColor: colors.primary[900] }}
                iconRight="search"
                iconCenter
              />
            </View>
            <Button
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: colors.primary[900] }}
              iconRight="add"
              iconCenter
            />
          </View>

          <View className="flex flex-row items-center gap-2">
            <Button
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: colors.primary[900] }}
              iconRight="add"
              iconCenter
            />
            <Text className="font-vazir" style={{ color: colors.neutral[50] }}>
              چت جدید
            </Text>
          </View>
        </View>
      </MotiView>

      <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-2">
          {filterHistory.map((item, index) => (
            <MotiView
              key={`${item.id}-${animateKey}`}
              from={{ opacity: 0, translateX: -40 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", duration: 350, delay: index * 70 }}
            >
              <Text
                className="font-vazir py-4"
                style={{ color: colors.neutral[50] }}
              >
                {item.title}
              </Text>
            </MotiView>
          ))}
        </View>
      </ScrollView>

      <MotiView
        key={`bottom-${animateKey}`}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350, delay: 200 }}
      >
        <View className="flex flex-row items-center gap-2 mt-2">
          <View className="flex justify-center items-center rounded-full bg-purple-500 p-2 w-12 h-12">
            <Text className="font-vazir" style={{ color: colors.neutral[50] }}>
              Ni
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text
              className="font-bold font-vazir"
              style={{ color: colors.neutral[50] }}
            >
              Nima
            </Text>
            <Ionicons name="chevron-down" />
          </View>
        </View>
      </MotiView>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
