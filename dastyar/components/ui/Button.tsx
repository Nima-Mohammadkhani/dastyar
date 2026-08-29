import React, { useState } from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ButtonProps } from "@/types/ui";

interface EnhancedButtonProps extends ButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconClassName?: string;
  iconRotate?: number;
  iconCenter?: boolean;
}

const Button = ({
  title,
  onPress,
  variant = "primary",
  className = "",
  textClassName = "",
  style,
  textStyle,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  iconSize = 20,
  iconClassName = "",
  iconRotate = 0,
  iconCenter = false,
  rippleColor,
}: EnhancedButtonProps) => {
  const [opacity] = useState(new Animated.Value(1));

  const baseClasses =
    "flex-row rounded-lg items-center justify-center overflow-hidden";

  const variantClasses: Record<string, string> = {
    primary: "bg-blue-600",
    secondary: "bg-green-600",
    outline: "border border-blue-600 bg-transparent",
  };

  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textBase = "font-semibold font-vazir";
  const textVariant: Record<string, string> = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-blue-600",
  };

  const iconColor = variant === "outline" ? "#007AFF" : "#fff";

  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  };

  const buttonClasses =
    `${baseClasses} ${variantClasses[variant]} ` +
    (disabled ? "bg-gray-400 border-gray-300 " : "") +
    className;

  const textClasses =
    `${textBase} ${textVariant[variant]} ` +
    (disabled ? "text-gray-200 " : "") +
    textClassName;

  return (
    <Pressable
      onPress={!disabled && !loading ? onPress : undefined}
      disabled={disabled}
      android_ripple={{
        color:
          rippleColor ||
          (variant === "outline"
            ? "rgba(0,122,255,0.15)"
            : "rgba(255,255,255,0.2)"),
        borderless: false,
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={buttonClasses}
      style={style}
    >
      <Animated.View
        style={{
          opacity,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: iconCenter
            ? "center"
            : title
              ? "flex-start"
              : "center",
          flex: iconCenter ? 1 : undefined,
        }}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "outline" ? "#007AFF" : "#fff"}
            size="small"
          />
        ) : (
          <>
            {iconLeft && !iconCenter && (
              <Ionicons
                name={iconLeft}
                size={iconSize}
                color={iconColor}
                className={iconClassName}
                style={{
                  marginRight: title ? 6 : 0,
                  transform: [{ rotate: `${iconRotate}deg` }],
                }}
              />
            )}
            {title && (
              <Text className={textClasses} style={textStyle}>
                {title}
              </Text>
            )}
            {iconRight && (
              <Ionicons
                name={iconRight}
                size={iconSize}
                color={iconColor}
                className={iconClassName}
                style={{
                  marginLeft: title && !iconCenter ? 6 : 0,
                  transform: [{ rotate: `${iconRotate}deg` }],
                }}
              />
            )}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default Button;
