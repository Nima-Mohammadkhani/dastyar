import React, { forwardRef, useState } from "react";
import { TextInput, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputProps } from "@/types/ui";
import { toPersianNumber, toEnglishNumber } from "@/utils/persianNumber";

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      secureTextEntry,
      secureToggle = false,
      containerClassName = "",
      inputClassName = "",
      textClassName,
      onFocus,
      onBlur,
      onChangeText,
      unit,
      value,
      keyboardType,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePassword, setHidePassword] = useState(secureTextEntry);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChangeText = (text: string) => {
      if (
        keyboardType === "numeric" ||
        keyboardType === "number-pad" ||
        keyboardType === "phone-pad"
      ) {
        const numbersOnly = text.replace(/[^0-9۰-۹]/g, "");
        const englishText = toEnglishNumber(numbersOnly);
        onChangeText?.(englishText);
      } else {
        onChangeText?.(text);
      }
    };

    const displayValue =
      (keyboardType === "numeric" ||
        keyboardType === "number-pad" ||
        keyboardType === "phone-pad") &&
      value
        ? toPersianNumber(value.toString())
        : value;

    const isInputActive = isFocused || (value && value.toString().length > 0);

    return (
      <View className={`w-full mb-4 ${containerClassName}`}>
        {label && (
          <Text className={`mb-1 font-dana ${textClassName}`}>{label}</Text>
        )}

        <View
          className={`relative flex-row items-center border rounded-lg bg-white ${
            isFocused ? "border-hit" : "border-beerus"
          } ${error ? "border-red-500" : ""}`}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? "#2563EB" : "#9CA3AF"}
              style={{ marginRight: 8 }}
            />
          )}

          <TextInput
            className={`flex-1 py-2 font-dana ${inputClassName} ${
              unit && isInputActive ? "pr-20" : ""
            } ${unit && !isInputActive ? "pl-20" : ""}`}
            placeholderTextColor="#8C9197"
            secureTextEntry={hidePassword}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            ref={ref}
            value={displayValue}
            keyboardType={keyboardType || "default"}
            selectionColor={"black"}
            {...props}
          />

          {unit && (
            <Text
              className={`absolute font-dana-medium text-[#8C9197] ${
                isInputActive ? "end-3" : "start-3"
              }`}
            >
              {unit}
            </Text>
          )}

          {secureToggle && (
            <Pressable onPress={() => setHidePassword(!hidePassword)}>
              <Ionicons
                name={hidePassword ? "eye-off" : "eye"}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          )}

          {!secureToggle && rightIcon && (
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? "#2563EB" : "#9CA3AF"}
            />
          )}
        </View>

        {error && (
          <Text className="mt-1 text-red-500 text-sm font-dana">{error}</Text>
        )}
      </View>
    );
  },
);
Input.displayName = "Input";
export default Input;
