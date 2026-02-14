import Button from "@/components/ui/Button";
import { useTheme } from "@/constants/theme";
import {
  ScrollView,
  Text,
  useColorScheme,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@/components/ui/BottomSheet";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/ui/Input";
import { MotiView } from "moti";
import { useRouter } from "expo-router";

const Index = () => {
  const { colors, isDark } = useTheme();
  const scheme = useColorScheme();
  const [editSheet, setEditSheet] = useState<boolean>(false);
  const [name, setName] = useState<string>("Nima");
  const [userName, setUserName] = useState<string>("NimaMohammadkhani");
  const router = useRouter();
  const settingFeature = {
    myModel: [{ id: 1, title: "شخصی سازی" }],
    feature: [
      { id: 1, title: "فضای کاری", value: "شخصی" },
      {
        id: 2,
        title: "ارتقا به سطح بالاتر",
        action: () => router.push("/(drawer)/setting/upgrade"),
      },
      { id: 3, title: "ایمیل", value: "nimamohammadkhani" },
      { id: 4, title: "تم رنگی", value: "دستگاه" },
      { id: 5, title: "رنگ", value: "پیش فرض" },
      { id: 6, title: "عمومی" },
      { id: 7, title: "کنترل داده ها" },
      { id: 8, title: "درباره ما" },
    ],
  };

  const cardBg = scheme === "dark" ? "#1C1C1E" : "#F5F5F5";

  const SettingRow = ({ item, index }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 60 }}
      className="p-4 flex-row justify-between items-center"
    >
      <Pressable
        className="flex-row justify-between items-center w-full"
        onPress={item.action}
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="chevron-back" size={16} color={colors.neutral[500]} />
          {item.value && (
            <Text
              className="font-vazir text-sm"
              style={{ color: colors.neutral[500] }}
            >
              {item.value}
            </Text>
          )}
        </View>

        <Text className="font-vazir" style={{ color: colors.neutral[50] }}>
          {item.title}
        </Text>
      </Pressable>
    </MotiView>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: scheme == "dark" ? "#000000" : "white" }}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 500 }}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}
            className="items-center gap-2"
          >
            <View className="rounded-full bg-purple-500 w-20 h-20 justify-center items-center">
              <Text
                className="font-vazir"
                style={{ color: colors.neutral[50], fontSize: 24 }}
              >
                Ni
              </Text>
            </View>

            <View className="items-center">
              <Text
                className="font-vazir"
                style={{ color: colors.neutral[50] }}
              >
                {name}
              </Text>
              <Text
                className="font-vazir"
                style={{ color: colors.neutral[50] }}
              >
                {userName}
              </Text>
            </View>

            <Button
              title="ویرایش پروفایل"
              className="px-3 py-1"
              onPress={() => setEditSheet(true)}
              style={{ backgroundColor: colors.primary[900] }}
            />
          </MotiView>

          <View className="mt-8 gap-3 relative">
            <Text
              className="font-vazir text-sm"
              style={{ color: colors.neutral[500], direction: "rtl" }}
            >
              فود اینجا من
            </Text>

            <View
              className="rounded-md overflow-hidden gap-2"
              style={{ backgroundColor: cardBg }}
            >
              {settingFeature.myModel.map((item, index) => (
                <SettingRow key={item.id} item={item} index={index} />
              ))}
            </View>
          </View>

          <View className="mt-8 gap-3">
            <Text
              className="font-vazir text-sm"
              style={{ color: colors.neutral[500], direction: "rtl" }}
            >
              تنظیمات
            </Text>

            <View
              className="rounded-md overflow-hidden"
              style={{ backgroundColor: cardBg }}
            >
              {settingFeature.feature.map((item, index) => (
                <View key={item.id}>
                  <SettingRow item={item} index={index} />

                  {index !== settingFeature.feature.length - 1 && (
                    <View
                      className="w-full h-px"
                      style={{
                        backgroundColor: isDark
                          ? colors.neutral[800]
                          : colors.neutral[200],
                      }}
                    />
                  )}
                </View>
              ))}
            </View>

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: settingFeature.feature.length * 60 }}
            >
              <Pressable
                android_ripple={{ color: "#ddd" }}
                onPress={() => console.log("Logout")}
                className="p-4 flex-row justify-between items-center"
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={16}
                  color={colors.error.DEFAULT}
                />

                <View className="flex-row items-center gap-2">
                  <Text
                    className="font-vazir"
                    style={{ color: colors.error.DEFAULT }}
                  >
                    خروج از حساب کاربری
                  </Text>
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={colors.error.DEFAULT}
                  />
                </View>
              </Pressable>
            </MotiView>
          </View>
        </ScrollView>

        <BottomSheet visible={editSheet} onClose={() => setEditSheet(false)}>
          <View className="justify-center items-center gap-6 p-4">
            <View className="relative rounded-full bg-purple-500 w-20 h-20 justify-center items-center">
              <Text
                className="font-vazir"
                style={{ color: colors.neutral[50], fontSize: 24 }}
              >
                Ni
              </Text>
              <View className="bg-white p-0.5 rounded-full absolute bottom-0 end-2">
                <Ionicons name="camera" size={16} />
              </View>
            </View>

            <View className="relative w-full">
              <Input
                value={name}
                onChangeText={setName}
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
              <Text
                className="absolute -top-2 end-4 px-2 text-sm font-vazir"
                style={{
                  backgroundColor: cardBg,
                  color: colors.neutral[50],
                }}
              >
                نام
              </Text>
            </View>

            <View className="relative w-full">
              <Input
                value={userName}
                onChangeText={setUserName}
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
              <Text
                className="absolute -top-2 end-4 px-2 text-sm font-vazir"
                style={{
                  backgroundColor: cardBg,
                  color: colors.neutral[50],
                }}
              >
                نام کاربری
              </Text>
            </View>

            <View className="flex-row gap-2">
              <Button
                title="ذخیره پروفایل"
                style={{ backgroundColor: colors.primary[900] }}
                className="w-1/2 p-2 text-sm"
                onPress={() => setEditSheet(false)}
              />
              <Button
                title="انصراف"
                className="w-1/2 py-2 text-sm"
                textStyle={{ color: scheme === "dark" ? "black" : "white" }}
                style={{ backgroundColor: colors.neutral[50] }}
                onPress={() => setEditSheet(false)}
              />
            </View>
          </View>
        </BottomSheet>
      </MotiView>
    </SafeAreaView>
  );
};

export default Index;
