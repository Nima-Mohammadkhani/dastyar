import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { useState, useRef, useEffect } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";

const DataControl = () => {
  const { colors, isDark } = useTheme();
  const [modelImprovement, setModelImprovement] = useState(false);

  const [hasAnimated, setHasAnimated] = useState(false);
  const [exportSheet, setExportSheet] = useState(false);
  const [deleteAccountSheet, setDeleteAccountSheet] = useState(false);
  const [clearHistorySheet, setClearHistorySheet] = useState(false);
  const [archiveSheet, setArchiveSheet] = useState(false);

  const exportSheetRef = useRef(false);
  const deleteSheetRef = useRef(false);
  const clearSheetRef = useRef(false);
  const archiveSheetRef = useRef(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  const DataBox = ({ children, className = "" }: any) => (
    <MotiView
      from={hasAnimated ? undefined : { opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", delay: 200 }}
      className={`rounded-md overflow-hidden mb-4 ${className}`}
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      {children}
    </MotiView>
  );

  const BoxHeader = ({ title, icon, rightComponent }: any) => (
    <View
      className="flex-row-reverse justify-between items-center px-4"
      style={{
        backgroundColor: isDark ? colors.neutral[800] : colors.primary[900],
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
      }}
    >
      <Text className="font-vazir text-white">{title}</Text>
      {rightComponent}
    </View>
  );

  const DataRow = ({ children, onPress, showBorder = true }: any) => (
    <Pressable onPress={onPress}>
      <View className="relative">
        <View className="p-4">{children}</View>
        {showBorder && (
          <View
            className="w-full h-px absolute bottom-0 left-0 right-0"
            style={{ backgroundColor: borderColor }}
          />
        )}
      </View>
    </Pressable>
  );

  const ExportBottomSheet = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (exportSheet && !exportSheetRef.current) {
        exportSheetRef.current = true;
        setIsVisible(true);
      } else if (!exportSheet) {
        exportSheetRef.current = false;
        setIsVisible(false);
      }
    }, [exportSheet]);

    if (!isVisible) return null;

    return (
      <BottomSheet visible={exportSheet} onClose={() => setExportSheet(false)}>
        <View className="p-6">
          <View className="items-center mb-6">
            <View
              className="w-16 h-16 rounded-full justify-center items-center mb-4"
              style={{ backgroundColor: colors.primary[900] + "20" }}
            >
              <Ionicons
                name="download-outline"
                size={32}
                color={colors.primary[500]}
              />
            </View>
            <Text
              className="font-vazir text-lg mb-2"
              style={{ color: colors.neutral[50] }}
            >
              خروجی گرفتن از داده‌ها
            </Text>
            <Text
              className="font-vazir text-sm text-center"
              style={{ color: colors.neutral[400], lineHeight: 22 }}
            >
              جزییات حساب و مکالمات شما نیز شامل خواهد شد. داده‌ها در یک فایل
              قابل دانلود به ایمیل ثبت شده ارسال میشوند. لینک دانلود ۲۴ ساعت پس
              از دریافت منقضی میشود. پردازش ممکن است مدتی طول بکشد. وقتی آماده
              شد به شما اطلاع میدهیم.
            </Text>
          </View>

          <View className="flex-row gap-3 mt-4">
            <Button
              title="خروجی گرفتن از داده"
              style={{
                backgroundColor: colors.primary[900],
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: "white",
                fontSize: 14,
                fontFamily: "vazir",
              }}
              className="py-3"
              onPress={() => {
                setExportSheet(false);
              }}
            />
            <Button
              title="لغو"
              style={{
                backgroundColor: colors.neutral[50],
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: isDark ? "black" : "white",
                fontSize: 14,
                fontFamily: "vazir",
              }}
              className="py-3"
              onPress={() => setExportSheet(false)}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  const DeleteAccountBottomSheet = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (deleteAccountSheet && !deleteSheetRef.current) {
        deleteSheetRef.current = true;
        setIsVisible(true);
      } else if (!deleteAccountSheet) {
        deleteSheetRef.current = false;
        setIsVisible(false);
      }
    }, [deleteAccountSheet]);

    if (!isVisible) return null;

    return (
      <BottomSheet
        visible={deleteAccountSheet}
        onClose={() => setDeleteAccountSheet(false)}
      >
        <View className="p-6">
          <View className="items-center mb-6">
            <View
              className="w-16 h-16 rounded-full justify-center items-center mb-4"
              style={{ backgroundColor: colors.error.DEFAULT + "20" }}
            >
              <Ionicons
                name="warning-outline"
                size={32}
                color={colors.error.DEFAULT}
              />
            </View>
            <Text
              className="font-vazir text-lg mb-2"
              style={{ color: colors.neutral[50] }}
            >
              حذف حساب کاربری
            </Text>
            <Text
              className="font-vazir text-sm text-center"
              style={{ color: colors.neutral[400], lineHeight: 22 }}
            >
              آیا از حذف حساب کاربری خود مطمئن هستید؟ این عمل غیرقابل بازگشت
              بوده و تمام داده‌های شما پاک خواهد شد.
            </Text>
          </View>

          <View className="flex-row gap-3 mt-4">
            <Button
              title="حذف اکانت"
              style={{
                backgroundColor: colors.error.DEFAULT,
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: "white",
                fontSize: 14,
                fontFamily: "vazir",
              }}
              className="py-3"
              onPress={() => {
                setDeleteAccountSheet(false);
              }}
            />
            <Button
              title="لغو"
              style={{
                backgroundColor: colors.neutral[50],
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: isDark ? "black" : "white",
                fontSize: 14,
                fontFamily: "vazir",
              }}
              className="py-3"
              onPress={() => setDeleteAccountSheet(false)}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  const ClearHistoryBottomSheet = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (clearHistorySheet && !clearSheetRef.current) {
        clearSheetRef.current = true;
        setIsVisible(true);
      } else if (!clearHistorySheet) {
        clearSheetRef.current = false;
        setIsVisible(false);
      }
    }, [clearHistorySheet]);

    if (!isVisible) return null;

    return (
      <BottomSheet
        visible={clearHistorySheet}
        onClose={() => setClearHistorySheet(false)}
      >
        <View className="p-6">
          <View className="items-center mb-6">
            <View
              className="w-16 h-16 rounded-full justify-center items-center mb-4"
              style={{ backgroundColor: colors.error.DEFAULT + "20" }}
            >
              <Ionicons
                name="trash-outline"
                size={32}
                color={colors.error.DEFAULT}
              />
            </View>
            <Text
              className="font-vazir text-lg mb-2"
              style={{ color: colors.neutral[50] }}
            >
              پاک کردن تاریخچه چت
            </Text>
            <Text
              className="font-vazir text-sm text-center"
              style={{ color: colors.neutral[400], lineHeight: 22 }}
            >
              آیا از پاک کردن تمام تاریخچه چت خود مطمئن هستید؟ این عمل غیرقابل
              بازگشت است.
            </Text>
          </View>

          <View className="flex-row gap-3 mt-4">
            <Button
              title="پاک کردن"
              style={{
                backgroundColor: colors.error.DEFAULT,
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: "white",
                fontSize: 14,
                fontFamily: "vazir",
              }}
              className="py-3"
              onPress={() => {
                setClearHistorySheet(false);
              }}
            />
            <Button
              title="لغو"
              style={{
                backgroundColor: colors.neutral[50],
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: isDark ? "black" : "white",
                fontSize: 14,
                fontFamily: "vazir",
              }}
              className="py-3"
              onPress={() => setClearHistorySheet(false)}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  const ArchiveBottomSheet = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (archiveSheet && !archiveSheetRef.current) {
        archiveSheetRef.current = true;
        setIsVisible(true);
      } else if (!archiveSheet) {
        archiveSheetRef.current = false;
        setIsVisible(false);
      }
    }, [archiveSheet]);

    if (!isVisible) return null;

    return (
      <BottomSheet
        visible={archiveSheet}
        onClose={() => setArchiveSheet(false)}
      >
        <View className="p-6">
          <View className="items-center mb-6">
            <View
              className="w-16 h-16 rounded-full justify-center items-center mb-4"
              style={{ backgroundColor: colors.primary[900] + "20" }}
            >
              <Ionicons
                name="archive-outline"
                size={32}
                color={colors.primary[500]}
              />
            </View>
            <Text
              className="font-vazir text-lg mb-2"
              style={{ color: colors.neutral[50] }}
            >
              آرشیو چت‌ها
            </Text>
            <Text
              className="font-vazir text-sm text-center mb-4"
              style={{ color: colors.neutral[400], lineHeight: 22 }}
            >
              این بخش در حال توسعه است. به زودی می‌توانید چت‌های خود را آرشیو
              کنید.
            </Text>
          </View>

          <View className="items-center">
            <Button
              title="باشه"
              style={{
                backgroundColor: colors.primary[900],
                borderRadius: 8,
                paddingHorizontal: 32,
              }}
              textStyle={{
                color: "white",
                fontSize: 14,
                fontFamily: "vazir",
              }}
              className="py-3"
              onPress={() => setArchiveSheet(false)}
            />
          </View>
        </View>
      </BottomSheet>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <MotiView
          from={hasAnimated ? undefined : { opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", delay: 100 }}
          className="items-center mt-4 mb-2"
        >
          <Text
            className="font-vazir text-3xl"
            style={{ color: colors.neutral[50] }}
          >
            کنترل <Text style={{ color: colors.primary[900] }}>داده‌ها</Text>
          </Text>
          <Text
            className="font-vazir text-sm mt-2 text-center"
            style={{ color: colors.neutral[400] }}
          >
            مدیریت داده‌ها و حریم خصوصی شما
          </Text>
        </MotiView>

        <View className="mt-4">
          <Text
            className="font-vazir text-lg mb-3"
            style={{ color: colors.neutral[50], textAlign: "right" }}
          >
            داده‌ها
          </Text>

          <DataBox>
            <BoxHeader
              title="بهبود مدل برای همه"
              icon="stats-chart-outline"
              rightComponent={
                <Switch
                  value={modelImprovement}
                  onValueChange={setModelImprovement}
                  trackColor={{
                    false: isDark ? colors.neutral[700] : borderColor,
                    true: colors.primary[500],
                  }}
                  thumbColor={
                    modelImprovement
                      ? "white"
                      : isDark
                        ? colors.neutral[50]
                        : "white"
                  }
                  ios_backgroundColor={
                    isDark ? colors.neutral[700] : borderColor
                  }
                />
              }
            />
            <View className="p-4" style={{ direction: "rtl" }}>
              <Text
                className="font-vazir text-xs"
                style={{ color: colors.neutral[400], lineHeight: 20 }}
              >
                اجازه دهید از محتوای شما برای بهبود مدل استفاده شود. ما اقداماتی
                را برای محافظت از حریم خصوصی شما انجام میدهیم.
              </Text>
            </View>
          </DataBox>

          <DataBox>
            <DataRow onPress={() => setExportSheet(true)}>
              <View className="flex-row-reverse justify-between items-center">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  خروجی گرفتن از داده‌ها
                </Text>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </DataRow>
          </DataBox>

          <DataBox>
            <DataRow
              onPress={() => setDeleteAccountSheet(true)}
              showBorder={false}
            >
              <View className="flex-row-reverse justify-between items-center">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.error.DEFAULT }}
                >
                  پاک کردن اکانت فوداینجا
                </Text>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </DataRow>
          </DataBox>
        </View>

        <View className="mt-6">
          <Text
            className="font-vazir text-lg mb-3"
            style={{ color: colors.neutral[50], textAlign: "right" }}
          >
            تاریخچه چت
          </Text>

          <DataBox>
            <DataRow onPress={() => setArchiveSheet(true)}>
              <View className="flex-row-reverse justify-between items-center">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  آرشیو چت‌ها
                </Text>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </DataRow>

            <DataRow onPress={() => setArchiveSheet(true)}>
              <View className="flex-row-reverse justify-between items-center">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  تاریخچه چت‌های آرشیو
                </Text>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </DataRow>

            <DataRow
              onPress={() => setClearHistorySheet(true)}
              showBorder={false}
            >
              <View className="flex-row-reverse justify-between items-center">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.error.DEFAULT }}
                >
                  پاک کردن تاریخچه چت
                </Text>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={colors.neutral[400]}
                />
              </View>
            </DataRow>
          </DataBox>
        </View>
      </ScrollView>

      <ExportBottomSheet />
      <DeleteAccountBottomSheet />
      <ClearHistoryBottomSheet />
      <ArchiveBottomSheet />
    </SafeAreaView>
  );
};

export default DataControl;
