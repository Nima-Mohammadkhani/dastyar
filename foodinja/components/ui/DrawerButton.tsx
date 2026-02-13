import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "@/constants/theme";
type DrawerNav = DrawerNavigationProp<Record<string, object | undefined>>;
const DrawerButton = () => {
  const navigation = useNavigation<DrawerNav>();
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => navigation.openDrawer()}
      className="flex justify-center items-center rounded-full w-12 h-12 mt-4"
      style={{ backgroundColor: colors.primary[900] }}
    >
      <Ionicons name="menu" size={26} color={"white"} />
    </Pressable>
  );
};

export default DrawerButton;
