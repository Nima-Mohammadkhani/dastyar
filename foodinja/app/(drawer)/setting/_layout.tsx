import { Stack } from "expo-router";

const settingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        presentation: "card",
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="about" />
      <Stack.Screen name="dataContorol" />
      <Stack.Screen name="general" />
      <Stack.Screen name="personalization" />
      <Stack.Screen name="upgrade" />
    </Stack>
  );
};
export default settingLayout;
