import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";

const SettingsLayout = () => {
  const router = useRouter();
  const scheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        animation: "none",
        presentation: "card",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "تنظیمات",
          headerTitleStyle: { fontFamily: "VazirMedium" },
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={scheme == "dark" ? "white" : "black"}
              />
            </Pressable>
          ),
        }}
      />

      <Stack.Screen
        name="about"
        options={{
          title: "درباره ما",
          headerTitleStyle: { fontFamily: "VazirMedium" },
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={scheme == "dark" ? "white" : "black"}
              />
            </Pressable>
          ),
        }}
      />

      <Stack.Screen name="dataContorol" options={{ title: "Data Control" }} />

      <Stack.Screen name="general" options={{ title: "General" }} />

      <Stack.Screen
        name="personalization"
        options={{ title: "Personalization" }}
      />

      <Stack.Screen
        name="upgrade"
        options={{
          title: "ارتقا",
          headerTitleStyle: { fontFamily: "VazirMedium" },
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={scheme == "dark" ? "white" : "black"}
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
};

export default SettingsLayout;
