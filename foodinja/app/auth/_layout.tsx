import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";

const LoginLayout = () => {
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
        name="login"
        options={{
          title: "ورود یا ثبت نام",
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

export default LoginLayout;
