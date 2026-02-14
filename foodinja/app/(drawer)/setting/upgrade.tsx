import Button from "@/components/ui/Button";
import { useTheme } from "@/constants/theme";
import { useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";

const Upgrade = () => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("plus");

  const modelFeature = {
    plus: [
      { id: 1, feature: "دسترسی به GPT-5", plus: true, free: true },
      { id: 2, feature: "خروجی پیشرفته", plus: true, free: false },
      { id: 3, feature: "آپلود پیام و عکس بیشتر", plus: true, free: false },
      { id: 4, feature: "تولید عکس", plus: true, free: false },
      { id: 5, feature: "حافظه بیشتر", plus: true, free: false },
      { id: 6, feature: "دسترسی به امکانات جدید", plus: true, free: false },
      { id: 7, feature: "پردازش سریع‌تر", plus: true, free: false },
      { id: 8, feature: "پشتیبانی اولویت‌دار", plus: true, free: false },
    ],
    pro: [
      { id: 1, feature: "دسترسی به GPT-5", pro: true, free: true },
      { id: 2, feature: "خروجی پیشرفته", pro: true, free: true },
      { id: 3, feature: "آپلود پیام و عکس بیشتر", pro: true, free: true },
      { id: 4, feature: "تولید عکس", pro: true, free: true },
      { id: 5, feature: "حافظه بیشتر", pro: true, free: true },
      { id: 6, feature: "دسترسی به امکانات جدید", pro: true, free: true },
      { id: 7, feature: "پردازش سریع‌تر", pro: true, free: false },
      { id: 8, feature: "پشتیبانی اولویت‌دار", pro: true, free: false },
      { id: 9, feature: "دسترسی به API", pro: true, free: false },
      { id: 10, feature: "تحلیل پیشرفته داده", pro: true, free: false },
    ],
  };

  const tabs = [
    { id: "plus", title: "پلاس", icon: "star-outline" },
    { id: "pro", title: "حرفه‌ای", icon: "diamond-outline" },
  ];

  const currentFeatures =
    activeTab === "plus" ? modelFeature.plus : modelFeature.pro;

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  const TableRow = ({ item, index }: any) => {
    const isPlusActive = item.plus === true;
    const isProActive = item.pro === true;
    const isFreeActive = item.free === true;

    const getStatusIcon = (isActive: boolean) => {
      if (isActive) {
        return (
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: index * 50 }}
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primary[500]}
            />
          </MotiView>
        );
      }
      return (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 50 }}
        >
          <Text className="text-2xl" style={{ color: colors.neutral[400] }}>
            —
          </Text>
        </MotiView>
      );
    };

    return (
      <MotiView
        from={{ opacity: 0, translateX: 20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ delay: index * 80, type: "spring" }}
        className="relative"
      >
        <View className="flex flex-row-reverse justify-between items-center py-4 px-2">
          <Text
            className="font-vazir text-base flex-1"
            style={{ color: colors.neutral[50], textAlign: "right" }}
          >
            {item.feature}
          </Text>

          <View className="flex-row items-center gap-8">
            <View className="items-center w-16">
              {getStatusIcon(isFreeActive)}
            </View>

            <View className="items-center w-16">
              {getStatusIcon(activeTab === "plus" ? isPlusActive : isProActive)}
            </View>
          </View>
        </View>

        {index !== currentFeatures.length - 1 && (
          <View
            className="w-full h-px absolute bottom-0 left-0 right-0"
            style={{
              backgroundColor: isDark
                ? colors.neutral[800]
                : colors.neutral[200],
            }}
          />
        )}
      </MotiView>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* هدر */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", delay: 100 }}
          className="items-center mt-4"
        >
          <Text
            className="font-vazir text-3xl"
            style={{ color: colors.neutral[50] }}
          >
            فود اینجا{" "}
            <Text style={{ color: colors.primary[900] }}>
              {activeTab === "plus" ? "پلاس" : "حرفه‌ای"}
            </Text>
          </Text>
          <Text
            className="font-vazir text-sm mt-2 text-center"
            style={{ color: colors.neutral[400] }}
          >
            با ارتقا به نسخه پیشرفته، به امکانات بیشتری دسترسی پیدا کنید
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200 }}
          className="flex-row justify-center my-6"
        >
          {tabs.map((tab, index) => (
            <MotiView
              key={tab.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 250 + index * 50 }}
              className="flex-1"
            >
              <Pressable
                onPress={() => setActiveTab(tab.id)}
                className={`px-6 py-3 flex-row justify-center items-center gap-2 ${
                  index === 0 ? "rounded-l-md" : "rounded-r-md"
                }`}
                style={{
                  backgroundColor:
                    activeTab === tab.id ? colors.primary[900] : cardBg,
                  borderWidth: 1,
                  borderColor:
                    activeTab === tab.id ? colors.primary[500] : borderColor,
                }}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={20}
                  color={activeTab === tab.id ? "white" : colors.neutral[400]}
                />
                <Text
                  className="font-vazir text-base"
                  style={{
                    color: activeTab === tab.id ? "white" : colors.neutral[50],
                  }}
                >
                  {tab.title}
                </Text>
              </Pressable>
            </MotiView>
          ))}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          className="rounded-md overflow-hidden mb-6"
          style={{
            backgroundColor: cardBg,
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <View
            className="flex-row justify-between items-center p-4"
            style={{
              backgroundColor: isDark
                ? colors.neutral[800]
                : colors.primary[900],
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
            <Text className="font-vazir text-white">امکانات</Text>
            <View className="flex-row gap-8">
              <Text className="font-vazir text-white text-center w-16">
                رایگان
              </Text>
              <Text className="font-vazir text-white text-center w-16">
                {activeTab === "plus" ? "پلاس" : "حرفه‌ای"}
              </Text>
            </View>
          </View>

          <View>
            {currentFeatures.map((item, index) => (
              <TableRow key={item.id} item={item} index={index} />
            ))}
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 800, type: "spring" }}
          className="mb-8"
        >
          <Button
            title={`ارتقا به نسخه ${activeTab === "plus" ? "پلاس" : "حرفه‌ای"}`}
            style={{
              backgroundColor: colors.primary[900],
              paddingVertical: 16,
              borderRadius: 12,
            }}
            textStyle={{
              color: "white",
              fontSize: 16,
              fontFamily: "VazirMedium",
            }}
            onPress={() => console.log(`Upgrade to ${activeTab}`)}
          />

          <Text
            className="font-vazir text-xs text-center mt-3"
            style={{ color: colors.neutral[400] }}
          >
            با پرداخت، قوانین و مقررات را می‌پذیرید
          </Text>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Upgrade;
