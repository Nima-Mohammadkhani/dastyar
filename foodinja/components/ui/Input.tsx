import React, { forwardRef, useState } from "react";
import {
  TextInput,
  View,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  secureToggle?: boolean;
  unit?: string;
  containerClassName?: string;
  inputClassName?: string;
  textClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}

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
      textClassName = "",
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
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
        onChangeText?.(numbersOnly);
      } else {
        onChangeText?.(text);
      }
    };

    const isInputActive = isFocused || (value && value.toString().length > 0);

    return (
      <View
        className={`w-full mb-4 font-vazir ${containerClassName}`}
        style={containerStyle}
      >
        {label && (
          <Text className={textClassName} style={labelStyle}>
            {label}
          </Text>
        )}

        <View
          className={`relative flex-row items-center rounded px-2 ${
            error
              ? "border-red-500"
              : isFocused
                ? "border-blue-500"
                : "border-gray-300"
          }`}
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
            className={inputClassName}
            style={[
              { flex: 1, paddingVertical: 8, paddingHorizontal: 4},
              unit && isInputActive ? { paddingRight: 40 } : {},
              unit && !isInputActive ? { paddingLeft: 40 } : {},
              inputStyle,
            ]}
            placeholderTextColor="#8C9197"
            secureTextEntry={hidePassword}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            ref={ref}
            value={value}
            keyboardType={keyboardType || "default"}
            selectionColor={"black"}
            {...props}
          />

          {unit && (
            <Text
              className="absolute text-gray-400"
              style={{
                right: isInputActive ? 12 : undefined,
                left: !isInputActive ? 12 : undefined,
              }}
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
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          )}

          {!secureToggle && rightIcon && (
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? "#2563EB" : "#9CA3AF"}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        {error && (
          <Text className="mt-1 text-red-500 text-sm" style={errorStyle}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";

export default Input;
