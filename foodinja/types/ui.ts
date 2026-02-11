import { TextInputProps, ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type IconName = keyof typeof Ionicons.glyphMap;

export interface ButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  iconSize?: number;
  rippleColor?: string;
  iconColor?:string
}

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  secureToggle?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  textClassName?: string;
  unit?: string;
}

export interface IbottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface IradioProps {
  label?: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string, checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  size?: number;
  containerClassName?: string;
  labelClassName?: string;
  radioClassName?: string;
  borderColor?: string;
  bgColor?: string;
}

export interface IradioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  direction?: "column" | "row";
  className?: string;
  disabled?: boolean;
  borderColor?: string;
  bgColor?: string;
}

export interface IradioGroupContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export interface IcheckboxProps {
  label?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  size?: number;
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  checkedColor?: string;
  uncheckedColor?: string;
}
