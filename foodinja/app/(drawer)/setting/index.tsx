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
  const [themeSheet, setThemeSheet] = useState<boolean>(false);
  const [languageSheet, setLanguageSheet] = useState<boolean>(false);
  const [name, setName] = useState<string>("Nima");
  const [userName, setUserName] = useState<string>("NimaMohammadkhani");
  const [selectedTheme, setSelectedTheme] = useState<string>("system");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("fa");
  const router = useRouter();

  const changeTheme = (theme: string) => {
    setSelectedTheme(theme);
    console.log("Theme changed to:", theme);
  };

  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    console.log("Language changed to:", lang);
  };

  const getThemeDisplayValue = () => {
    switch (selectedTheme) {
      case "light":
        return "روشن";
      case "dark":
        return "تاریک";
      case "system":
        return "همراه با دستگاه";
      default:
        return "همراه با دستگاه";
    }
  };

  const getLanguageDisplayValue = () => {
    return selectedLanguage === "fa" ? "فارسی" : "English";
  };

  const settingFeature = {
    myModel: [{ id: 1, title: "شخصی سازی", icon: true }],
    feature: [
      { id: 1, title: "فضای کاری", value: "شخصی" },
      {
        id: 2,
        title: "ارتقا به سطح بالاتر",
        action: () => router.push("/(drawer)/setting/upgrade"),
        icon: true,
      },
      { id: 3, title: "ایمیل", value: "nimamohammadkhani" },
      {
        id: 4,
        title: "تم رنگی",
        value: getThemeDisplayValue(),
        icon: true,
        action: () => setThemeSheet(true),
      },
      { id: 5, title: "رنگ", value: "پیش فرض" },
      {
        id: 6,
        title: "عمومی",
        value: getLanguageDisplayValue(),
        icon: true,
        action: () => setLanguageSheet(true),
      },
      {
        id: 7,
        title: "کنترل داده ها",
        icon: true,
        action: () => router.push("/(drawer)/setting/dataContorol"),
      },
      {
        id: 8,
        title: "درباره ما",
        icon: true,
        action: () => router.push("/(drawer)/setting/about"),
      },
    ],
  };

  const cardBg = scheme === "dark" ? "#1C1C1E" : "#F5F5F5";

  const SettingRow = ({ item, index }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 60 }}
      className="p-4"
    >
      <Pressable
        className="flex-row justify-between items-center w-full"
        onPress={item.action}
      >
        <View className="flex-row items-center gap-2">
          {item.icon && (
            <Ionicons
              name="chevron-back"
              size={16}
              color={colors.neutral[500]}
            />
          )}
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

  const ThemeOption = ({ theme, label, icon, currentTheme }: any) => (
    <Pressable
      onPress={() => changeTheme(theme)}
      className="flex-row-reverse items-center justify-between p-4 rounded-lg mb-2"
      style={{
        backgroundColor: currentTheme === theme ? colors.primary[50] : cardBg,
        borderWidth: 1,
        borderColor:
          currentTheme === theme ? colors.primary[500] : "transparent",
      }}
    >
      <View className="flex-row items-center gap-3">
        <Text
          className="font-vazir text-base"
          style={{
            color:
              currentTheme === theme ? colors.primary[900] : colors.neutral[50],
          }}
        >
          {label}
        </Text>
      </View>

      {currentTheme === theme && (
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary[500]}
          />
        </MotiView>
      )}
    </Pressable>
  );

  const LanguageOption = ({ lang, label, currentLang }: any) => (
    <Pressable
      onPress={() => changeLanguage(lang)}
      className="flex-row-reverse items-center justify-between p-4 rounded-lg mb-2"
      style={{
        backgroundColor: currentLang === lang ? colors.primary[50] : cardBg,
        borderWidth: 1,
        borderColor: currentLang === lang ? colors.primary[500] : "transparent",
      }}
    >
      <Text
        className="font-vazir text-base"
        style={{
          color:
            currentLang === lang ? colors.primary[900] : colors.neutral[50],
        }}
      >
        {label}
      </Text>

      {currentLang === lang && (
        <MotiView
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary[500]}
          />
        </MotiView>
      )}
    </Pressable>
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
              style={{ color: colors.neutral[500], textAlign: "right" }}
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
              style={{ color: colors.neutral[500], textAlign: "right" }}
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
                  borderRadius: 8,
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
                  borderRadius: 8,
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
                style={{
                  backgroundColor: colors.primary[900],
                  borderRadius: 8,
                }}
                className="w-1/2 p-2 text-sm"
                onPress={() => setEditSheet(false)}
              />
              <Button
                title="انصراف"
                className="w-1/2 py-2 text-sm rounded-md"
                textStyle={{ color: scheme === "dark" ? "black" : "white" }}
                style={{ backgroundColor: colors.neutral[50], borderRadius: 8 }}
                onPress={() => setEditSheet(false)}
              />
            </View>
          </View>
        </BottomSheet>

        <BottomSheet visible={themeSheet} onClose={() => setThemeSheet(false)}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring" }}
            className="p-4"
          >
            <Text
              className="font-vazir text-xl text-center mb-6"
              style={{ color: colors.neutral[50] }}
            >
              انتخاب تم
            </Text>

            <ThemeOption
              theme="light"
              label="روشن"
              icon="sunny-outline"
              currentTheme={selectedTheme}
            />

            <ThemeOption
              theme="dark"
              label="تاریک"
              icon="moon-outline"
              currentTheme={selectedTheme}
            />

            <ThemeOption
              theme="system"
              label="همراه با دستگاه"
              icon="phone-portrait-outline"
              currentTheme={selectedTheme}
            />

            <Button
              title="تایید"
              style={{
                backgroundColor: colors.primary[900],
                marginTop: 20,
                paddingVertical: 14,
                borderRadius: 10,
              }}
              textStyle={{
                color: "white",
                fontSize: 16,
                fontFamily: "VazirMedium",
              }}
              onPress={() => setThemeSheet(false)}
            />
          </MotiView>
        </BottomSheet>

        <BottomSheet
          visible={languageSheet}
          onClose={() => setLanguageSheet(false)}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "spring" }}
            className="p-4"
          >
            <Text
              className="font-vazir text-xl text-center mb-6"
              style={{ color: colors.neutral[50] }}
            >
              انتخاب زبان
            </Text>

            <LanguageOption
              lang="fa"
              label="فارسی"
              currentLang={selectedLanguage}
            />

            <LanguageOption
              lang="en"
              label="English"
              currentLang={selectedLanguage}
            />

            <Button
              title="تایید"
              style={{
                backgroundColor: colors.primary[900],
                marginTop: 20,
                paddingVertical: 14,
                borderRadius: 10,
              }}
              textStyle={{
                color: "white",
                fontSize: 16,
                fontFamily: "VazirMedium",
              }}
              onPress={() => setLanguageSheet(false)}
            />
          </MotiView>
        </BottomSheet>
      </MotiView>
    </SafeAreaView>
  );
};

export default Index;
