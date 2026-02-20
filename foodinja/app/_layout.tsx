import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import "react-native-reanimated";
import "react-native-gesture-handler";
import "../global.css";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rehydrateAuth } from "@/redux/authSlice";
import type { UserInfo } from "@/types/api";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AuthRehydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    const rehydrate = async () => {
      try {
        const [token, refreshToken, userDataStr] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('refreshToken'),
          AsyncStorage.getItem('userData'),
        ]);

        if (token || refreshToken || userDataStr) {
          const userData = userDataStr ? JSON.parse(userDataStr) as UserInfo : null;
          dispatch(rehydrateAuth({
            token: token || null,
            refreshToken: refreshToken || null,
            userData,
          }));
        }
      } catch (error) {
        console.error('Error rehydrating auth:', error);
      }
    };

    rehydrate();
  }, [dispatch]);

  return null;
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    VazirMedium: require("../assets/font/Vazir-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthRehydrator />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack>
        </BottomSheetModalProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
