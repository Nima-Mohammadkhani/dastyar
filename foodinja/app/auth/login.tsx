import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toPersianNumber } from "@/utils/converter";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { setAuthTokens, setUserData } from "@/redux/authSlice";
import { useGetUserInfoQuery } from "@/redux/service/app";

type Step = "email" | "otp";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { refetch: refetchUserInfo } = useGetUserInfoQuery(undefined, {
    skip: true,
  });

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  useEffect(() => {
    let interval: any;
    if (currentStep === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleEmailSubmit = () => {
    if (email.includes("@")) {
      setCurrentStep("otp");
      setTimer(120);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      // Auto-focus next input if needed
    }
  };

  const handleOtpSubmit = () => {
    if (otp.every((digit) => digit !== "")) {
      // Handle OTP submission
    }
  };

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;

      if (url.includes("oauth2/redirect")) {
        try {
          const parsedUrl = Linking.parse(url);
          const accessToken = parsedUrl.queryParams?.access_token as string;
          const refreshToken = parsedUrl.queryParams?.refresh_token as string;

          if (accessToken && refreshToken) {
            dispatch(
              setAuthTokens({
                access_token: accessToken,
                refresh_token: refreshToken,
              }),
            );

            try {
              const userInfoResult = await refetchUserInfo();
              if (userInfoResult.data) {
                dispatch(setUserData(userInfoResult.data));
              }
            } catch (error) {
              console.error("Failed to fetch user info:", error);
            }

            router.replace("/(drawer)");
          }
        } catch (error) {
          console.error("OAuth redirect error:", error);
          Alert.alert("خطا", "خطا در احراز هویت. لطفا دوباره تلاش کنید.");
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, router, refetchUserInfo]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      const loginUrl = "https://foodinja.ir/api/users/login";
      const redirectUrl = Linking.createURL("(drawer)/", {
        scheme: "foodinja",
      });

      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const parsedUrl = Linking.parse(result.url);
        const accessToken = parsedUrl.queryParams?.access_token as string;
        const refreshToken = parsedUrl.queryParams?.refresh_token as string;

        if (accessToken && refreshToken) {
          dispatch(
            setAuthTokens({
              access_token: accessToken,
              refresh_token: refreshToken,
            }),
          );

          try {
            const userInfoResult = await refetchUserInfo();
            if (userInfoResult.data) {
              dispatch(setUserData(userInfoResult.data));
            }
          } catch (error) {
            console.error("Failed to fetch user info:", error);
          }

          router.replace("/(drawer)");
        } else {
          Alert.alert("خطا", "احراز هویت ناموفق بود. لطفا دوباره تلاش کنید.");
        }
      } else if (result.type === "cancel") {
        // User cancelled
      } else {
        Alert.alert("خطا", "خطا در باز کردن صفحه ورود. لطفا دوباره تلاش کنید.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert(
        "خطا",
        "خطا در اتصال به سرور. لطفا اتصال اینترنت خود را بررسی کنید.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    setCurrentStep("otp");
  };

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("email");
      setOtp(["", "", "", "", ""]);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-4 py-8">
            <MotiView
              from={hasAnimated ? undefined : { opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 100 }}
              className="items-center gap-4 mb-8"
            >
              <Image
                source={require("@/assets/images/logo/logo.png")}
                className="w-24 h-24"
              />
              <Text
                className="font-vazir text-base"
                style={{ color: colors.neutral[50] }}
              >
                ورود یا ثبت نام
              </Text>
              <Text
                className="font-vazir text-sm text-center px-4"
                style={{ color: colors.neutral[400], lineHeight: 22 }}
              >
                با مدل‌های هوشمندتر کار کنید، شخصی‌سازی کنید و چت‌های خود را
                ذخیره کنید
              </Text>
            </MotiView>

            {currentStep === "email" && (
              <MotiView
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
                transition={{ type: "timing", duration: 400, delay: 200 }}
                className="gap-4"
              >
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ایمیل خود را وارد کنید"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerClassName="p-1 text-base rounded-md"
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: borderColor,
                    backgroundColor: cardBg,
                  }}
                  inputStyle={{
                    color: colors.neutral[50],
                    fontFamily: "VazirMedium",
                    textAlign: "right",
                  }}
                />

                <Button
                  title="ادامه"
                  style={{
                    backgroundColor: colors.primary[900],
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                  textStyle={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "VazirMedium",
                  }}
                  className="py-3"
                  onPress={handleEmailSubmit}
                  disabled={!email.includes("@")}
                />

                <View className="flex-row items-center my-4">
                  <View
                    className="flex-1 h-px"
                    style={{ backgroundColor: borderColor }}
                  />
                  <Text
                    className="mx-4 font-vazir text-sm"
                    style={{ color: colors.neutral[400] }}
                  >
                    یا
                  </Text>
                  <View
                    className="flex-1 h-px"
                    style={{ backgroundColor: borderColor }}
                  />
                </View>

                <Pressable
                  onPress={handleGoogleLogin}
                  className="mb-3"
                  disabled={isLoading}
                >
                  <View
                    className="flex-row-reverse items-center justify-between p-4 rounded-md"
                    style={{
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: borderColor,
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      {isLoading ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.primary[500]}
                        />
                      ) : (
                        <Image
                          source={require("@/assets/images/logo/google.png")}
                          className="w-6 h-6"
                        />
                      )}
                      <Text
                        className="font-vazir text-base"
                        style={{ color: colors.neutral[50] }}
                      >
                        {isLoading ? "در حال اتصال..." : "ادامه با گوگل"}
                      </Text>
                    </View>
                    {!isLoading && (
                      <Ionicons
                        name="chevron-back"
                        size={20}
                        color={colors.neutral[400]}
                      />
                    )}
                  </View>
                </Pressable>

                <Pressable onPress={handlePhoneLogin}>
                  <View
                    className="flex-row-reverse items-center justify-between p-4 rounded-md"
                    style={{
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: borderColor,
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons
                        name="call-outline"
                        size={24}
                        color={colors.primary[500]}
                      />
                      <Text
                        className="font-vazir text-base"
                        style={{ color: colors.neutral[50] }}
                      >
                        ادامه با تلفن
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={colors.neutral[400]}
                    />
                  </View>
                </Pressable>
              </MotiView>
            )}

            {currentStep === "otp" && (
              <MotiView
                from={{ opacity: 0, translateX: 50 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -50 }}
                transition={{ type: "timing", duration: 400, delay: 200 }}
                className="gap-6"
              >
                <View className="items-center">
                  <Text
                    className="font-vazir text-lg"
                    style={{ color: colors.neutral[50] }}
                  >
                    کد تأیید
                  </Text>
                  <Text
                    className="font-vazir text-sm text-center mt-2"
                    style={{ color: colors.neutral[400] }}
                  >
                    کد ۵ رقمی به ایمیل {email} ارسال شد
                  </Text>
                </View>

                <View className="flex-row justify-center gap-3 px-4">
                  {otp.map((digit, index) => (
                    <MotiView
                      key={index}
                      from={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 300 + index * 50,
                        type: "spring",
                        damping: 20,
                      }}
                    >
                      <Input
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        containerClassName="w-14 h-14 rounded-md"
                        containerStyle={{
                          borderWidth: 1,
                          borderColor: borderColor,
                          backgroundColor: cardBg,
                        }}
                        inputStyle={{
                          color: colors.neutral[50],
                          fontFamily: "VazirMedium",
                          textAlign: "center",
                          fontSize: 24,
                        }}
                      />
                    </MotiView>
                  ))}
                </View>

                <View className="flex-row-reverse justify-center items-center gap-1">
                  <Text
                    className="font-vazir text-sm"
                    style={{ color: colors.neutral[400] }}
                  >
                    زمان باقی‌مانده:
                  </Text>
                  <Text
                    className="font-vazir text-sm"
                    style={{ color: colors.primary[500] }}
                  >
                    {toPersianNumber(formatTime(timer))}
                  </Text>
                </View>

                {timer === 0 && (
                  <Pressable onPress={() => setTimer(120)}>
                    <Text
                      className="font-vazir text-sm text-center"
                      style={{ color: colors.primary[500] }}
                    >
                      ارسال مجدد کد
                    </Text>
                  </Pressable>
                )}

                <Button
                  title="تأیید"
                  style={{
                    backgroundColor: colors.primary[900],
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                  textStyle={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "VazirMedium",
                  }}
                  className="py-3"
                  onPress={handleOtpSubmit}
                  disabled={!otp.every((digit) => digit !== "")}
                />
              </MotiView>
            )}

            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 500 }}
              className="mt-8"
            >
              <Text
                className="font-vazir text-xs text-center"
                style={{ color: colors.neutral[400] }}
              >
                با ادامه، شرایط و قوانین فودینجا را می‌پذیرید
              </Text>
            </MotiView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
