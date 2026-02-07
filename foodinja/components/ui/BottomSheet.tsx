import React, { forwardRef, useEffect, useRef, useState } from "react";
import { View, Text, Keyboard, KeyboardEvent, Platform } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTextInput,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CustomBottomSheetProps {
  children?: React.ReactNode;
  visible?: boolean;
  onClose?: () => void;
}

export type CustomBottomSheetRef = BottomSheetModal;

const CustomBottomSheet = forwardRef<BottomSheetModal, CustomBottomSheetProps>(
  (props, ref) => {
    const insets = useSafeAreaInsets();
    const internalRef = useRef<BottomSheetModal>(null);
    const sheetRef = (ref || internalRef) as React.RefObject<BottomSheetModal>;

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
      const showEvent =
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent =
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
      });

      const hideSub = Keyboard.addListener(hideEvent, () => {
        setKeyboardHeight(0);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    useEffect(() => {
      if (props.visible) {
        sheetRef.current?.dismiss();
        setTimeout(() => {
          sheetRef.current?.present();
        }, 50);
      } else {
        sheetRef.current?.dismiss();
      }
    }, [props.visible]);

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        onDismiss={props.onClose}
        enablePanDownToClose
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#ccc", width: 50 }}
        backgroundStyle={{ backgroundColor: "white", borderRadius: 24 }}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView
          style={{
            paddingBottom: keyboardHeight
              ? keyboardHeight + 25 + insets.bottom
              : insets.bottom,
          }}
        >
          {props.children || (
            <>
              <View className="mb-4 items-center">
                <Text className="text-lg font-bold text-gray-800">
                  عنوان باتم شیت
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  کیبورد کاملاً داینامیک
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-600 mb-2">
                  هیچ محتوایی زیر کیبورد قرار نمی‌گیرد
                </Text>
                <View className="h-20 bg-gray-100 rounded-lg w-full mb-2" />
              </View>

              {/* Input */}
              <View className="mb-2">
                <Text className="text-sm font-medium mb-1 text-gray-700">
                  تست ورودی:
                </Text>
                <BottomSheetTextInput
                  placeholder="اینجا تایپ کن..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-right"
                  style={{ fontSize: 16 }}
                />
              </View>

              <View className="mt-4">
                <Text className="text-center text-xs text-gray-400">
                  همیشه 25px فاصله از بالای کیبورد
                </Text>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CustomBottomSheet;
