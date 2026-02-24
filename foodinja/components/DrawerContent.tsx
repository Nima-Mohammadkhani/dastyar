import { useDrawerStatus } from "@react-navigation/drawer";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import Input from "./ui/Input";
import { useState, useEffect } from "react";
import { useTheme } from "@/constants/theme";
import Button from "./ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetConversationsQuery, useGetUserInfoQuery } from "@/redux/service/app";

const CustomDrawerContent = () => {
  const [search, setSearch] = useState<string>("");
  const { colors } = useTheme();
  const drawerStatus = useDrawerStatus();
  const isDrawerOpen = drawerStatus === "open";
  const [animateKey, setAnimateKey] = useState(0);
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  const { data: conversationsData, isLoading, refetch } = useGetConversationsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: userInfo } = useGetUserInfoQuery(undefined, {
    skip: !isAuthenticated,
  });

  const userName = userInfo?.name || "کاربر";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  useEffect(() => {
    if (isDrawerOpen) {
      setAnimateKey((prev) => prev + 1);
      if (isAuthenticated) {
        refetch();
      }
    }
  }, [isDrawerOpen, isAuthenticated, refetch]);

  const conversations = conversationsData?.conversations || [];
  const filterHistory = conversations.filter((item) =>
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
              onPress={() => router.replace("/(drawer)")}
            />
          </View>

          <Pressable
            onPress={() => {
              router.replace("/(drawer)");
            }}
            className="flex flex-row items-center gap-2"
          >
            <Button
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: colors.primary[900] }}
              iconRight="add"
              iconCenter
            />
            <Text className="font-vazir" style={{ color: colors.neutral[50] }}>
              چت جدید
            </Text>
          </Pressable>
        </View>
      </MotiView>

      <ScrollView className="flex-1 mt-4" showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-2">
          {isLoading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
          ) : filterHistory.length === 0 ? (
            <View className="flex-1 justify-center items-center py-8">
              <Text
                className="font-vazir text-sm text-center"
                style={{ color: colors.neutral[400] }}
              >
                {isAuthenticated ? "هیچ مکالمه‌ای یافت نشد" : "برای مشاهده مکالمات حساب خود شوید"}
              </Text>
            </View>
          ) : (
            filterHistory.map((item, index) => (
              <MotiView
                key={`${item.conversation_id}-${animateKey}`}
                from={{ opacity: 0, translateX: -40 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "timing", duration: 350, delay: index * 70 }}
              >
                <Pressable
                  onPress={() => {
                    router.push(`/(drawer)/chat/${item.conversation_id}`);
                  }}
                >
                  <Text
                    className="font-vazir py-4"
                    style={{ color: colors.neutral[50] }}
                  >
                    {item.title}
                  </Text>
                </Pressable>
              </MotiView>
            ))
          )}
        </View>
      </ScrollView>

      <MotiView
        key={`bottom-${animateKey}`}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 350, delay: 200 }}
      >
        <Pressable
          onPress={() => router.push("/(drawer)/setting")}
          className="flex flex-row items-center gap-2 mt-2"
        >
          <View className="flex justify-center items-center rounded-full bg-purple-500 p-2 w-12 h-12">
            <Text className="font-vazir" style={{ color: colors.neutral[50] }}>
              {userInitials}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text
              className="font-bold font-vazir"
              style={{ color: colors.neutral[50] }}
            >
              {userName}
            </Text>
            <Ionicons name="chevron-down" color={colors.neutral[50]} />
          </View>
        </Pressable>
      </MotiView>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
