import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useState } from "react";
import { MotiView } from "moti";
import { useTheme } from "@/constants/theme";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAdminLoginMutation, useGetUserInfoQuery } from "@/redux/service/app";
import { useDispatch } from "react-redux";
import { setAuthTokens, setUserData } from "@/redux/authSlice";
import { secureStorage } from "@/utils/secureStorage";
import { mockDB } from "@/utils/mockDatabase";
import { useRouter } from "expo-router";

const Login = () => {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  const [adminLogin] = useAdminLoginMutation();
  const { refetch: refetchUserInfo } = useGetUserInfoQuery(undefined, { skip: true });

  const handleLogin = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("خطا", "لطفاً اسمت رو وارد کن");
      return;
    }

    try {
      setLoading(true);
      await mockDB.setUserName(trimmedName);

      const result = await adminLogin({
        email: "user@local.app",
        password: "mock",
      }).unwrap();

      await Promise.all([
        secureStorage.setToken(result.access_token),
        secureStorage.setRefreshToken(result.refresh_token),
      ]);

      dispatch(setAuthTokens({ access_token: result.access_token, refresh_token: result.refresh_token }));

      try {
        const userInfoResult = await refetchUserInfo();
        if (userInfoResult.data) {
          dispatch(setUserData(userInfoResult.data));
          await secureStorage.setUserData(JSON.stringify(userInfoResult.data));
        }
      } catch {}

      router.dismissAll();
      setTimeout(() => {
        router.replace("/(drawer)");
      }, 100);
    } catch (error) {
      Alert.alert("خطا", "مشکلی پیش اومد، دوباره امتحان کن");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-8 justify-center">
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
              className="items-center gap-3 mb-10"
            >
              <View
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary[900] }}
              >
                <Text className="text-white text-3xl font-vazir">AI</Text>
              </View>
              <Text
                className="font-vazir text-2xl"
                style={{ color: colors.neutral[50] }}
              >
                دستیار هوشمند
              </Text>
              <Text
                className="font-vazir text-sm text-center"
                style={{ color: colors.neutral[400], lineHeight: 22 }}
              >
                اسمت رو وارد کن و شروع کن
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500, delay: 200 }}
              className="gap-4"
            >
              <Input
                value={name}
                onChangeText={setName}
                placeholder="اسمت رو بنویس..."
                autoCapitalize="words"
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
                  fontSize: 16,
                }}
                onSubmitEditing={handleLogin}
              />

              <Button
                title={loading ? "در حال ورود..." : "شروع کن"}
                style={{
                  backgroundColor: name.trim() ? colors.primary[900] : colors.neutral[600],
                  borderRadius: 8,
                  marginTop: 8,
                }}
                textStyle={{
                  color: "white",
                  fontSize: 16,
                  fontFamily: "VazirMedium",
                }}
                className="py-4"
                onPress={handleLogin}
                disabled={loading || !name.trim()}
              />
            </MotiView>

            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 600 }}
              className="mt-10"
            >
              <Text
                className="font-vazir text-xs text-center"
                style={{ color: colors.neutral[500] }}
              >
                همه چیز به صورت محلی ذخیره میشه
              </Text>
            </MotiView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
