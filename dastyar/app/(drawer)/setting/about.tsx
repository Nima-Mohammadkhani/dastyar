import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";

const About = () => {
  const { colors, isDark } = useTheme();
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const aboutText = `یه سوال داری؟ یه مشکل داری؟ یه ایده در ذهنت داری؟

دستیار هوشمند اینجاست تا کمکت کنه. هر چیزی که بخوای بدونی — از کد نوشتن تا توضیح مفاهیم، از ترجمه متن تا پیدا کردن راه‌حل — اینجا جوابش هست.

این دستیار کاملاً روی دستگاه تو کار می‌کنه. بدون نیاز به اینترنت، بدون ارسال اطلاعات به هیچ سروری.

فرق ما با بقیه چیه؟
بیشتر ابزارهای AI به سرور متصلن و داده‌هات رو آپلود می‌کنن.

اما این دستیار کاملاً لوکاله. همه مکالمات، تنظیمات و داده‌ها روی همین گوشی ذخیره میشن.

هر سوالی داشتی، هر وقت که خواستی، اینجام! 🤖`;

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (currentIndex < aboutText.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + aboutText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 22);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? "#000000" : "white" }}
    >
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", delay: 100 }}
          className="items-center mt-4 mb-6"
        >
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: colors.primary[900] + "20" }}
          >
            <Ionicons name="hardware-chip-outline" size={40} color={colors.primary[500]} />
          </View>
          <Text className="font-vazir text-3xl" style={{ color: colors.neutral[50] }}>
            درباره{" "}
            <Text style={{ color: colors.primary[900] }}>دستیار هوشمند</Text>
          </Text>
          <Text
            className="font-vazir text-sm mt-2 text-center"
            style={{ color: colors.neutral[400] }}
          >
            دستیار AI محلی — همیشه در دسترس، بدون اینترنت
          </Text>
        </MotiView>

        {/* About card with typing effect */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          className="rounded-md overflow-hidden mb-4"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
        >
          <View
            className="flex-row items-center gap-2 p-4"
            style={{
              backgroundColor: isDark ? colors.neutral[800] : colors.primary[900],
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
              direction: "rtl",
            }}
          >
            <Ionicons name="hardware-chip-outline" size={20} color="white" />
            <Text className="font-vazir text-white">دستیار هوشمند</Text>
          </View>

          <View className="p-4">
            <Text
              className="font-vazir text-base"
              style={{ color: colors.neutral[50], lineHeight: 28, textAlign: "right" }}
            >
              {displayedText}
              {currentIndex < aboutText.length && (
                <Text style={{ color: colors.primary[500] }}>|</Text>
              )}
            </Text>
          </View>

          <View className="w-full h-px" style={{ backgroundColor: borderColor }} />

          {/* Stats */}
          <View className="flex-row justify-around p-4">
            {[
              { icon: "chatbubbles-outline", count: "∞", label: "پیام بی‌نهایت" },
              { icon: "lock-closed-outline", count: "۱۰۰٪", label: "حریم خصوصی" },
              { icon: "flash-outline", count: "آفلاین", label: "بدون اینترنت" },
            ].map((stat, index) => (
              <MotiView
                key={stat.label}
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 500 + index * 100, type: "spring" }}
                className="items-center flex-1"
              >
                <View
                  className="w-12 h-12 rounded-md justify-center items-center mb-2"
                  style={{ backgroundColor: colors.primary[900] + "20" }}
                >
                  <Ionicons name={stat.icon as any} size={24} color={colors.primary[500]} />
                </View>
                <Text className="font-vazir text-base" style={{ color: colors.primary[500] }}>
                  {stat.count}
                </Text>
                <Text
                  className="font-vazir text-xs text-center"
                  style={{ color: colors.neutral[400] }}
                >
                  {stat.label}
                </Text>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Feature cards */}
        {[
          { icon: "shield-checkmark-outline", title: "کاملاً لوکال", desc: "هیچ داده‌ای به سرور ارسال نمیشه" },
          { icon: "save-outline", title: "ذخیره مکالمات", desc: "تاریخچه چت‌ها در گوشی ذخیره میشه" },
          { icon: "color-palette-outline", title: "شخصی‌سازی", desc: "تنظیمات و ترجیحات خودت رو ثبت کن" },
        ].map((f, i) => (
          <MotiView
            key={f.title}
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 600 + i * 100 }}
            className="rounded-md p-4 mb-3 flex-row-reverse items-center gap-3"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <View
              className="w-10 h-10 rounded-md items-center justify-center"
              style={{ backgroundColor: colors.primary[900] + "20" }}
            >
              <Ionicons name={f.icon as any} size={22} color={colors.primary[500]} />
            </View>
            <View className="flex-1 items-end">
              <Text className="font-vazir text-base" style={{ color: colors.neutral[50] }}>
                {f.title}
              </Text>
              <Text className="font-vazir text-xs mt-1" style={{ color: colors.neutral[400] }}>
                {f.desc}
              </Text>
            </View>
          </MotiView>
        ))}

        {/* Version */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 900 }}
          className="rounded-md p-4 mb-6"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
        >
          {[
            { label: "نسخه اپ", value: "1.0.0" },
            { label: "پلتفرم", value: "React Native / Expo" },
            { label: "ذخیره‌سازی", value: "AsyncStorage (لوکال)" },
          ].map((item, i) => (
            <View
              key={item.label}
              className="flex-row-reverse justify-between items-center py-3"
              style={{
                borderBottomWidth: i < 2 ? 1 : 0,
                borderBottomColor: borderColor,
              }}
            >
              <Text className="font-vazir text-sm" style={{ color: colors.neutral[50] }}>
                {item.label}
              </Text>
              <Text className="font-vazir text-sm" style={{ color: colors.neutral[400] }}>
                {item.value}
              </Text>
            </View>
          ))}
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
