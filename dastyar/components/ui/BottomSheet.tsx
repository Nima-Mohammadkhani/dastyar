import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardEvent,
  Platform,
  useColorScheme,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IbottomSheetProps } from "@/types/ui";
import { useTheme } from "@/constants/theme";

export type CustomBottomSheetRef = BottomSheetModal;

const CustomBottomSheet = forwardRef<BottomSheetModal, IbottomSheetProps>(
  (props, ref) => {
    const insets = useSafeAreaInsets();
    const internalRef = useRef<BottomSheetModal>(null);
    const sheetRef = (ref || internalRef) as React.RefObject<BottomSheetModal>;

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const { colors } = useTheme();
    const scheme = useColorScheme();
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
        backgroundStyle={{
          borderRadius: 24,
          backgroundColor: scheme == "dark" ? "#1C1C1E" : "#ffffff",
        }}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView
          style={{
            backgroundColor: scheme == "dark" ? "#1C1C1E" : "#ffffff",
            paddingBottom: keyboardHeight
              ? keyboardHeight + 25 + insets.bottom
              : insets.bottom,
          }}
        >
          {props.children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default CustomBottomSheet;
