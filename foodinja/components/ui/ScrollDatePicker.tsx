import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { toPersianNumber } from "@/utils/converter";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/constants/theme";

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;

interface ScrollDatePickerProps {
  onTimeChange?: (hours: number, minutes: number) => void;
  initialHours?: number;
  initialMinutes?: number;
}

const ScrollDatePicker: React.FC<ScrollDatePickerProps> = ({
  onTimeChange,
  initialHours = 0,
  initialMinutes = 30,
}) => {
  const [selectedHours, setSelectedHours] = useState(initialHours);
  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);
  const { colors, isDark } = useTheme();

  const hoursScrollRef = useRef<ScrollView>(null);
  const minutesScrollRef = useRef<ScrollView>(null);

  const hours = Array.from({ length: 13 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToIndex(hoursScrollRef, selectedHours);
      scrollToIndex(minutesScrollRef, minutes.indexOf(selectedMinutes));
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const scrollToIndex = (
    ref: React.RefObject<ScrollView | null>,
    index: number,
  ) => {
    ref.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const lastVibrateTime = useRef(0);

  const handleScrollVibration = () => {
    const now = Date.now();
    if (now - lastVibrateTime.current > 100) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastVibrateTime.current = now;
    }
  };

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    type: "hours" | "minutes",
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);

    if (type === "hours") {
      const hour = hours[index];
      if (hour !== undefined && hour !== selectedHours) {
        setSelectedHours(hour);
        onTimeChange?.(hour, selectedMinutes);
      }
    } else {
      const minute = minutes[index];
      if (minute !== undefined && minute !== selectedMinutes) {
        setSelectedMinutes(minute);
        onTimeChange?.(selectedHours, minute);
      }
    }
  };

  const renderColumn = (
    items: number[],
    selectedValue: number,
    ref: React.RefObject<ScrollView | null>,
    type: "hours" | "minutes",
  ) => {
    const paddingItems = Math.floor(VISIBLE_ITEMS / 2);

    return (
      <View className="flex-1">
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => handleScroll(e, type)}
          onScrollEndDrag={(e) => handleScroll(e, type)}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          onScroll={() => handleScrollVibration()}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * paddingItems,
          }}
        >
          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            const displayText =
              type === "hours"
                ? `${toPersianNumber(item.toString())} ساعت`
                : toPersianNumber(item.toString().padStart(2, "0"));

            return (
              <View
                key={index}
                style={{
                  height: ITEM_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: isSelected ? 18 : 16,
                    color: isSelected
                      ? colors.primary[500]
                      : colors.neutral[400],
                    fontFamily: "VazirMedium",
                  }}
                >
                  {displayText}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View
      className="rounded-md overflow-hidden"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <View
        className="p-3"
        style={{
          backgroundColor: isDark ? colors.neutral[800] : colors.primary[900],
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Text className="font-vazir text-white text-center">زمان آشپزی</Text>
      </View>

      <View
        className="relative"
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
      >
        <View
          className="absolute left-0 right-0 mx-4"
          pointerEvents="none"
          style={{
            top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
            height: ITEM_HEIGHT,
            backgroundColor: colors.primary[900] + "15",
            borderRadius: 8,
            zIndex: 1,
          }}
        />

        <View
          className="flex-row"
          style={{
            height: ITEM_HEIGHT * VISIBLE_ITEMS,
            zIndex: 2,
          }}
        >
          <View className="flex-1">
            {renderColumn(hours, selectedHours, hoursScrollRef, "hours")}
          </View>

          <View className="flex-1">
            {renderColumn(
              minutes,
              selectedMinutes,
              minutesScrollRef,
              "minutes",
            )}
          </View>
        </View>
      </View>

      <View
        className="p-3 flex-row-reverse justify-center gap-4"
        style={{
          backgroundColor: isDark ? colors.neutral[800] : colors.neutral[100],
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Text className="font-vazir" style={{ color: colors.neutral[400] }}>
          {toPersianNumber(selectedHours.toString())} ساعت
        </Text>
        <Text className="font-vazir" style={{ color: colors.neutral[400] }}>
          {toPersianNumber(selectedMinutes.toString().padStart(2, "0"))} دقیقه
        </Text>
      </View>
    </View>
  );
};

export default ScrollDatePicker;
