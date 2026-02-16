import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";

const About = () => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"about" | "developers">("about");

  const [aboutDisplayedText, setAboutDisplayedText] = useState("");
  const [aboutCurrentIndex, setAboutCurrentIndex] = useState(0);
  const [devDisplayedText, setDevDisplayedText] = useState("");
  const [devCurrentIndex, setDevCurrentIndex] = useState(0);
  const [showDevCards, setShowDevCards] = useState(false);

  const aboutText = `امروز ناهار چی درست کنم؟
امشب شام چی بپزم؟
تو یخچال فقط اینا رو دارم، چیا میشه باهاشون درست کرد؟
مهمون دارم ولی نمی‌دونم چه مواد اولیه‌ای باید بخرم؟
حواسم نبود نمک زیاد ریختم، چطور درستش کنم؟

این سوال‌ها برای همه‌ی ما آشناست. سوال هرروزه‌ی مامان‌های ایرانی! :) و هیچی هم که دستپخت مامان‌های ایرانی نمی‌شه…

فودینجا از همین جا متولد شد! یه دستیار آشپزی برای مامان‌ها… برای خودمون… یه همراه با تجربه برای آشپزای مبتدی و حرفه‌ای برای جواب به سوال‌های «چی درست کنم؟» و «چطور درست کنم؟»

فودینجا فقط به دنبال جواب دادن نیست؛ اینجا جاییه که می‌تونی خلاقیتت در آشپزی رو هم کشف کنی. هر ایده، هر تجربه‌ای که تا حالا تو آشپزخونه داشتی، می‌تونه اینجا بهت کمک کنه تا دستورهای جدید و خوشمزه بسازی.

اما فرق فودینجا با بقیه‌ی هوش‌های مصنوعیا چیه؟
بیشتر هوش‌های مصنوعی آچارفرانسه‌ان؛ از هر چیزی یه مقداری می‌دونن.

اما فودینجا تخصصش آشپزیه . دقیقاً برای همین کار ساخته شده.

برخلاف بقیه که فقط تیترهای سایت‌های آشپزی رو مرور می‌کنن، فودینجا کل دستورها، تجربه‌ها و ریزه‌کاری‌های آشپزی رو می‌شناسه و دقیق‌تر و واقعی‌تر راهنماییت می‌کنه.

هر سوالی در رابطه با آشپزی برات پیش اومد، جوابش اینجا پیش فودینجاست! 🍳

جایی که آشپزی باهاش راحت، لذت‌بخش و خلاقانه می‌شه. فقط کافیه سوالت رو تایپ کنی تا دستورهای خاص و خوشمزه رو بهت یادبده. اینجا همیشه یه ایده‌ی تازه و هیجان‌انگیز منتظرته!`;

  const devIntroText = `فودینجا با عشق و علاقه به آشپزی توسط دو نفر ساخته شده. یکی عاشق فرانت‌اند و طراحی، یکی هم عاشق بک‌اند و هوش مصنوعی. اما هر دوتامون یه هدف داریم: کمک به تو برای پختن غذاهای خوشمزه! 😊`;

  useEffect(() => {
    if (activeTab === "about") {
      setAboutDisplayedText("");
      setAboutCurrentIndex(0);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "about" && aboutCurrentIndex < aboutText.length) {
      const timer = setTimeout(() => {
        setAboutDisplayedText((prev) => prev + aboutText[aboutCurrentIndex]);
        setAboutCurrentIndex((prev) => prev + 1);
      }, 25);
      return () => clearTimeout(timer);
    }
  }, [aboutCurrentIndex, activeTab]);

  useEffect(() => {
    if (activeTab === "developers") {
      setDevDisplayedText("");
      setDevCurrentIndex(0);
      setShowDevCards(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "developers" && devCurrentIndex < devIntroText.length) {
      const timer = setTimeout(() => {
        setDevDisplayedText((prev) => prev + devIntroText[devCurrentIndex]);
        setDevCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    } else if (
      activeTab === "developers" &&
      devCurrentIndex >= devIntroText.length
    ) {
      setTimeout(() => setShowDevCards(true), 300);
    }
  }, [devCurrentIndex, activeTab]);

  const developers = {
    frontend: {
      name: "نیما محمدخانی",
      role: "توسعه‌دهنده فرانت‌اند و طراح تجربه کاربری",
      avatar: "NI",
      color: "#3B82F6",
      email: "nima@foodinga.com",
      linkedin: "https://linkedin.com/in/nima",
      github: "https://github.com/nima",
      skills: ["React Native", "TypeScript", "UI/UX", "Moti"],
    },
    backend: {
      name: "علی اکبر محترمی",
      role: "توسعه‌دهنده بک‌اند و متخصص ماشین لرنینگ",
      avatar: "AL",
      color: "#8B5CF6",
      email: "aliakbar@foodinga.com",
      linkedin: "https://linkedin.com/in/aliakbar",
      github: "https://github.com/aliakbar",
      skills: ["Python", "FastAPI", "TensorFlow", "NLP"],
    },
  };

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const DeveloperCard = ({ dev, type, index }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: 30 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 200, type: "spring" }}
      className="rounded-md overflow-hidden mb-4"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <View
        className="flex-row justify-between items-center p-4"
        style={{
          backgroundColor: isDark ? colors.neutral[800] : colors.primary[900],
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <View
          className="flex-row w-full justify-start items-center gap-2"
          style={{ direction: "rtl" }}
        >
          <View
            className="w-10 h-10 rounded-full justify-center items-center"
            style={{ backgroundColor: dev.color + "40" }}
          >
            <Text className="font-vazir-bold text-lg text-white">
              {dev.avatar}
            </Text>
          </View>
          <View>
            <Text className="font-vazir-bold text-base text-white">
              {dev.name}
            </Text>
            <Text className="font-vazir text-xs text-white/80">
              {type === "frontend" ? "فرانت‌اند" : "بک‌اند/ML"}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4">
        <Text
          className="font-vazir text-sm mb-3"
          style={{ color: colors.neutral[400], direction: "rtl" }}
        >
          {dev.role}
        </Text>

        <View className="flex-row-reverse flex-wrap gap-2 mb-4">
          {dev.skills.map((skill: string, idx: number) => (
            <MotiView
              key={skill}
              from={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 400 + idx * 50 }}
              className="px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: isDark
                  ? colors.neutral[800]
                  : colors.neutral[200],
              }}
            >
              <Text
                className="font-vazir text-xs"
                style={{ color: colors.neutral[50] }}
              >
                {skill}
              </Text>
            </MotiView>
          ))}
        </View>

        <View
          className="w-full h-px mb-4"
          style={{ backgroundColor: borderColor }}
        />

        <View className="flex-row justify-around">
          <Pressable onPress={() => handleLinkPress(`mailto:${dev.email}`)}>
            {({ pressed }) => (
              <MotiView
                animate={{ scale: pressed ? 0.95 : 1 }}
                transition={{ type: "spring" }}
                className="items-center"
              >
                <View
                  className="w-12 h-12 rounded-md justify-center items-center mb-1"
                  style={{ backgroundColor: colors.primary[900] + "20" }}
                >
                  <Ionicons name="mail" size={22} color={colors.primary[500]} />
                </View>
                <Text
                  className="font-vazir text-xs"
                  style={{ color: colors.neutral[400] }}
                >
                  ایمیل
                </Text>
              </MotiView>
            )}
          </Pressable>

          {/* لینکدین */}
          <Pressable onPress={() => handleLinkPress(dev.linkedin)}>
            {({ pressed }) => (
              <MotiView
                animate={{ scale: pressed ? 0.95 : 1 }}
                transition={{ type: "spring" }}
                className="items-center"
              >
                <View
                  className="w-12 h-12 rounded-md justify-center items-center mb-1"
                  style={{ backgroundColor: "#0077B5" + "20" }}
                >
                  <Ionicons name="logo-linkedin" size={22} color="#0077B5" />
                </View>
                <Text
                  className="font-vazir text-xs"
                  style={{ color: colors.neutral[400] }}
                >
                  لینکدین
                </Text>
              </MotiView>
            )}
          </Pressable>

          {/* گیت‌هاب */}
          <Pressable onPress={() => handleLinkPress(dev.github)}>
            {({ pressed }) => (
              <MotiView
                animate={{ scale: pressed ? 0.95 : 1 }}
                transition={{ type: "spring" }}
                className="items-center"
              >
                <View
                  className="w-12 h-12 rounded-md justify-center items-center mb-1"
                  style={{ backgroundColor: isDark ? "#fff" : "#333" + "20" }}
                >
                  <Ionicons
                    name="logo-github"
                    size={22}
                    color={isDark ? "#fff" : "#333"}
                  />
                </View>
                <Text
                  className="font-vazir text-xs"
                  style={{ color: colors.neutral[400] }}
                >
                  گیت‌هاب
                </Text>
              </MotiView>
            )}
          </Pressable>
        </View>
      </View>
    </MotiView>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDark ? "#000000" : "white" }}
    >
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
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
            درباره <Text style={{ color: colors.primary[900] }}>فودینجا</Text>
          </Text>
          <Text
            className="font-vazir text-sm mt-2 text-center"
            style={{ color: colors.neutral[400] }}
          >
            دستیار هوشمند آشپزی برای همه مامان‌های ایرانی
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 200 }}
          className="flex-row-reverse justify-center my-6"
        >
          {[
            {
              id: "about",
              title: "درباره فودینجا",
              icon: "information-circle",
            },
            { id: "developers", title: "توسعه‌دهندگان", icon: "people" },
          ].map((tab, index) => (
            <MotiView
              key={tab.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 250 + index * 50 }}
              className="flex-1"
            >
              <Pressable
                onPress={() => setActiveTab(tab.id as "about" | "developers")}
                className={`px-6 py-3 flex-row justify-center items-center gap-2 ${
                  index === 0 ? "rounded-r-md" : "rounded-l-md"
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

        {activeTab === "about" && (
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
              <View
                className="flex-row w-full justify-start items-center gap-2"
                style={{ direction: "rtl" }}
              >
                <Image
                  source={require("@/assets/images/logo/logo.png")}
                  className="w-6 h-6"
                />
                <Text className="font-vazir text-white">فودینجا</Text>
              </View>
            </View>

            <View className="p-4">
              <Text
                className="font-vazir text-base"
                style={{
                  color: colors.neutral[50],
                  lineHeight: 28,
                  textAlign: "right",
                }}
              >
                {aboutDisplayedText}
                {aboutCurrentIndex < aboutText.length && (
                  <MotiView
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 500, loop: true }}
                    className="w-0.5 h-5 bg-primary-500 inline-block"
                  />
                )}
              </Text>
            </View>

            <View
              className="w-full h-px"
              style={{ backgroundColor: borderColor }}
            />

            <View className="flex-row justify-around p-4">
              {[
                { icon: "restaurant", count: "۱۰۰۰+", label: "دستور غذا" },
                { icon: "people", count: "۵۰۰۰+", label: "کاربر فعال" },
                {
                  icon: "chatbubbles",
                  count: "۲۰۰۰۰+",
                  label: "سوال پاسخ داده",
                },
              ].map((stat, index) => (
                <MotiView
                  key={stat.label}
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 500 + index * 100, type: "spring" }}
                  className="items-center"
                >
                  <View
                    className="w-12 h-12 rounded-md justify-center items-center mb-2"
                    style={{ backgroundColor: colors.primary[900] + "20" }}
                  >
                    <Ionicons
                      name={stat.icon as any}
                      size={24}
                      color={colors.primary[500]}
                    />
                  </View>
                  <Text
                    className="font-vazir text-base"
                    style={{ color: colors.primary[500] }}
                  >
                    {stat.count}
                  </Text>
                  <Text
                    className="font-vazir text-xs"
                    style={{ color: colors.neutral[400] }}
                  >
                    {stat.label}
                  </Text>
                </MotiView>
              ))}
            </View>
          </MotiView>
        )}

        {activeTab === "developers" && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 }}
          >
            <View
              className="rounded-md overflow-hidden mb-4"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <View
                className="p-4"
                style={{
                  backgroundColor: isDark
                    ? colors.neutral[800]
                    : colors.primary[900],
                  borderBottomWidth: 1,
                  borderBottomColor: borderColor,
                }}
              >
                <View
                  className="flex-row w-full justify-start items-center gap-2"
                  style={{ direction: "rtl" }}
                >
                  <Image
                    source={require("@/assets/images/logo/logo.png")}
                    className="w-6 h-6"
                  />
                  <Text className="font-vazir text-white">تیم فودینجا</Text>
                </View>
              </View>

              <View className="p-4">
                <Text
                  className="font-vazir text-base"
                  style={{
                    color: colors.neutral[50],
                    lineHeight: 28,
                    textAlign: "right",
                  }}
                >
                  {devDisplayedText}
                  {devCurrentIndex < devIntroText.length && (
                    <MotiView
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 500, loop: true }}
                      className="w-0.5 h-5 bg-primary-500 inline-block"
                    />
                  )}
                </Text>
              </View>
            </View>

            {showDevCards && (
              <>
                <DeveloperCard
                  dev={developers.frontend}
                  type="frontend"
                  index={0}
                />
                <DeveloperCard
                  dev={developers.backend}
                  type="backend"
                  index={1}
                />
              </>
            )}
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
