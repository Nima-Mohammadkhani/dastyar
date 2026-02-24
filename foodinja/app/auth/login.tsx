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
  Modal,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toPersianNumber } from "@/utils/converter";
import { WebView } from "react-native-webview";
import { useAuthDeepLink } from "@/hooks/useAuthDeepLink";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import BottomSheet from "@/components/ui/BottomSheet";
import { useAdminLoginMutation, useGetUserInfoQuery } from "@/redux/service/app";
import { useDispatch } from "react-redux";
import { setAuthTokens, setUserData } from "@/redux/authSlice";
import { secureStorage } from "@/utils/secureStorage";

type Step = "email" | "otp";

const Login = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [showAdminSheet, setShowAdminSheet] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const [adminLogin] = useAdminLoginMutation();
  const { refetch: refetchUserInfo } = useGetUserInfoQuery(undefined, {
    skip: true,
  });

  const getUserAgent = () => {
    if (Platform.OS === 'ios') {
      return 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
    } else {
      return 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    }
  };

  const { handleWebViewRedirect, loading: authLoading } = useAuthDeepLink(
    () => {
      setShowWebView(false);
    },
    (error) => {
      console.error("خطا در احراز هویت:", error);
      Alert.alert(
        "خطا",
        error.message || "احراز هویت ناموفق بود. لطفا دوباره تلاش کنید."
      );
      setShowWebView(false);
    }
  );

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
    }
  };

  const handleOtpSubmit = () => {
    if (otp.every((digit) => digit !== "")) {
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await WebBrowser.openAuthSessionAsync(
        "https://foodinja.ir/api/users/mobile/login",
        "foodinja://auth"
      );
    } catch (error) {
      console.error("خطا در باز کردن مرورگر:", error);
      Alert.alert(
        "خطا",
        "نمی‌توان مرورگر را باز کرد. لطفا دوباره تلاش کنید."
      );
    }
  };

  const handleCloseWebView = () => {
    setShowWebView(false);
    setWebViewLoading(true);
  };

  const handleShouldStartLoadWithRequest = (request: { url: string }) => {
    const { url } = request;

    if (url.startsWith("foodinja://auth")) {
      console.log("دریافت redirect OAuth:", url);

      handleWebViewRedirect(url).catch((error) => {
        console.error("خطا در پردازش redirect:", error);
      });

      return false;
    }

    return true;
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("خطای WebView:", nativeEvent);

    if (!nativeEvent.url?.startsWith("foodinja://")) {
      Alert.alert(
        "خطا",
        "خطا در بارگذاری صفحه ورود. لطفا اتصال اینترنت خود را بررسی کنید."
      );
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

  const handleAdminLogin = async () => {
    try {
      setAdminLoading(true);
      const result = await adminLogin({
        email: "admin@foodinja.ir",
        password: "admin123456",
      }).unwrap();

      console.log("Admin Login Response:", JSON.stringify(result, null, 2));

      if (!result.access_token || !result.refresh_token) {
        throw new Error("Invalid token response: missing tokens");
      }

      await Promise.all([
        secureStorage.setToken(result.access_token),
        secureStorage.setRefreshToken(result.refresh_token),
      ]);

      dispatch(
        setAuthTokens({
          access_token: result.access_token,
          refresh_token: result.refresh_token,
        })
      );

      try {
        const userInfoResult = await refetchUserInfo();
        if (userInfoResult.data) {
          dispatch(setUserData(userInfoResult.data));
          await secureStorage.setUserData(JSON.stringify(userInfoResult.data));
        }
      } catch (userInfoError) {
      }

      setShowAdminSheet(false);
      router.dismissAll();
      setTimeout(() => {
        router.replace("/(drawer)");
      }, 100);
    } catch (error) {
      console.error("Admin Login Error:", error);
      console.error("Admin Login Error Details:", JSON.stringify(error, null, 2));
      Alert.alert(
        "خطا",
        "ورود ادمین ناموفق بود. لطفا دوباره تلاش کنید."
      );
    } finally {
      setAdminLoading(false);
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

                <Pressable
                  onPress={() => setShowAdminSheet(true)}
                  className="mt-4"
                >
                  <Text
                    className="font-vazir text-sm text-center"
                    style={{ color: colors.neutral[400] }}
                  >
                    ورود ادمین
                  </Text>
                </Pressable>

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
                  disabled={showWebView || authLoading}
                >
                  <View
                    className="flex-row-reverse items-center justify-between p-4 rounded-md"
                    style={{
                      backgroundColor: cardBg,
                      borderWidth: 1,
                      borderColor: borderColor,
                      opacity: showWebView || authLoading ? 0.6 : 1,
                    }}
                  >
                    <View className="flex-row items-center gap-3">
                      {authLoading ? (
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
                        {authLoading ? "در حال احراز هویت..." : "ادامه با گوگل"}
                      </Text>
                    </View>
                    {!authLoading && (
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

      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseWebView}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: borderColor,
            }}
          >
           
            <Pressable onPress={handleCloseWebView}>
              <Ionicons name="close" size={24} color={colors.neutral[50]} />
            </Pressable>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.neutral[50],
                fontFamily: "VazirMedium",
              }}
            >
              ورود با گوگل
            </Text>
          </View>

          <WebView
            ref={webViewRef}
            source={{ uri: "https://foodinja.ir/api/users/mobile/login" }}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onError={handleWebViewError}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsBackForwardNavigationGestures={false}
            userAgent={getUserAgent()}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            style={{ flex: 1 }}
          />

          
        </View>
      </Modal>

      <BottomSheet visible={showAdminSheet} onClose={() => setShowAdminSheet(false)}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: 20 }}
          transition={{ type: "timing", duration: 400 }}
          className="p-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View style={{ width: 24 }} />
            <Pressable onPress={() => setShowAdminSheet(false)}>
              <Ionicons name="close" size={24} color={colors.neutral[400]} />
            </Pressable>
          </View>

          <View className="items-center gap-2 mb-6">
            <Text
              className="font-vazir text-xl"
              style={{ color: colors.neutral[50] }}
            >
              ورود ادمین
            </Text>
            <Text
              className="font-vazir text-sm text-center"
              style={{ color: colors.neutral[400] }}
            >
              با کلیک روی دکمه زیر وارد حساب ادمین شوید
            </Text>
          </View>

          <Button
            title={adminLoading ? "در حال ورود..." : "ورود ادمین"}
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
            onPress={handleAdminLogin}
            disabled={adminLoading}
          />
        </MotiView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Login;
