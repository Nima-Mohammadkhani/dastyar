import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useTheme } from "@/constants/theme";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type DrawerNav = DrawerNavigationProp<Record<string, object | undefined>>;
const DrawerButton = ({ setLoginSheet }: any) => {
  const navigation = useNavigation<DrawerNav>();
  const { colors } = useTheme();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  return (
    <View className="flex flex-row justify-between items-center w-full">
      <Pressable
        onPress={() => navigation.openDrawer()}
        className="flex justify-center items-center rounded-full w-12 h-12 mt-4"
        style={{ backgroundColor: colors.primary[900] }}
      >
        <Ionicons name="menu" size={26} color={"white"} />
      </Pressable>
      {!isAuthenticated && (
        <Pressable
          onPress={() => setLoginSheet(true)}
          className="flex justify-center items-center rounded-full w-12 h-12 mt-4 pb-1.5"
          style={{ backgroundColor: colors.primary[900] }}
        >
          <Text className="font-vazir text-white">ورود</Text>
        </Pressable>
      )}
    </View>
  );
};

export default DrawerButton;
