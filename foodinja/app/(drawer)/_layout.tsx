import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/DrawerContent";

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}
      drawerContent={() => <CustomDrawerContent />}
    >
      <Drawer.Screen name="index" options={{ title: "New Chat" }} />
      <Drawer.Screen name="account" options={{ title: "Account" }} />
      <Drawer.Screen name="settings" options={{ title: "Settings" }} />
    </Drawer>
  );
};

export default DrawerLayout;
