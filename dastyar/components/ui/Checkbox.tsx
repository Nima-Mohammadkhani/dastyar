import { IcheckboxProps } from "@/types/ui";
import React, { forwardRef, useEffect, useState } from "react";
import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CheckboxInner = ({
  size,
  isChecked,
  checkedColor = "#F77CA3",
  uncheckedColor = "#E5E7EB",
}: {
  size: number;
  isChecked: boolean;
  checkedColor?: string;
  uncheckedColor?: string;
}) => {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        backgroundColor: isChecked ? checkedColor : "#fff",
        borderWidth: 2,
        borderColor: isChecked ? checkedColor : uncheckedColor,
      }}
    >
      {isChecked && (
        <Ionicons name="checkmark" size={size * 0.75} color="#fff" />
      )}
    </View>
  );
};

const Checkbox = forwardRef<any, IcheckboxProps>((props, ref) => {
  const {
    label,
    value,
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    error,
    size = 24,
    containerClassName = "",
    labelClassName = "",
    checkboxClassName = "",
    checkedColor,
    uncheckedColor,
  } = props;

  const [internalChecked, setInternalChecked] =
    useState<boolean>(defaultChecked);

  useEffect(() => {
    if (typeof checked === "boolean") {
      setInternalChecked(checked);
    }
  }, [checked]);

  const isChecked = checked ?? internalChecked;
  const isDisabled = disabled;

  const handlePress = () => {
    if (isDisabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <View className={`${containerClassName}`}>
      <Pressable
        ref={ref}
        onPress={handlePress}
        className="flex-row items-center"
        accessible
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled: isDisabled }}
        accessibilityLabel={label ?? value}
      >
        <View className={`${checkboxClassName}`}>
          <CheckboxInner
            size={size}
            isChecked={isChecked}
            checkedColor={checkedColor}
            uncheckedColor={uncheckedColor}
          />
        </View>

        {label ? (
          <Text
            className={`mr-3 font-dana ${labelClassName} ${
              isDisabled ? "text-gray-400" : "text-gray-800"
            }`}
          >
            {label}
          </Text>
        ) : null}
      </Pressable>

      {error ? (
        <Text className="text-red-500 text-sm mt-1 font-dana">{error}</Text>
      ) : null}
    </View>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
