import {
  IradioGroupContextType,
  IradioGroupProps,
  IradioProps,
} from "@/types/ui";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  forwardRef,
} from "react";
import {
  Pressable,
  View,
  Text,
  GestureResponderEvent,
  Platform,
} from "react-native";

const RadioGroupContext = createContext<IradioGroupContextType | null>(null);

export const RadioGroup: React.FC<IradioGroupProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
  direction = "column",
  className = "",
  disabled = false,
}) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );

  const selected = value ?? internalValue;

  const setValue = (v: string) => {
    onValueChange?.(v);
    setInternalValue(v);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value: selected, onValueChange: setValue, disabled }}
    >
      <View className={`${direction === "row" ? "flex-row" : ""} ${className}`}>
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
};

const RadioInner = ({
  size,
  isChecked,
  borderColor,
  bgColor,
}: {
  size: number;
  isChecked: boolean;
  borderColor: string;
  bgColor: string;
}) => {
  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        borderWidth: 1.5,
        borderColor: isChecked ? borderColor : "#CBD5E1",
        backgroundColor: "#fff",
      }}
    >
      {isChecked && (
        <View
          style={{
            width: Math.round(size * 0.5),
            height: Math.round(size * 0.5),
            borderRadius: Math.round((size * 0.5) / 2),
            backgroundColor: bgColor,
          }}
        />
      )}
    </View>
  );
};

const Radio = forwardRef<any, IradioProps>((props, ref) => {
  const {
    label,
    value,
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    error,
    size = 20,
    containerClassName = "",
    labelClassName = "",
    radioClassName = "",
    borderColor = "",
    bgColor = "",
  } = props;

  const group = useContext(RadioGroupContext);
  const isInGroup = !!group;
  const groupValue = group?.value;
  const groupDisabled = group?.disabled ?? false;
  const groupOnChange = group?.onValueChange;

  const [internalChecked, setInternalChecked] =
    useState<boolean>(defaultChecked);

  useEffect(() => {
    if (typeof checked === "boolean") {
      setInternalChecked(checked);
    }
  }, [checked]);

  const isChecked = isInGroup ? groupValue === value : internalChecked;
  const isDisabled = disabled || groupDisabled;

  const handlePress = (e?: GestureResponderEvent) => {
    if (isDisabled) return;
    if (isInGroup) {
      groupOnChange?.(value);
      onChange?.(value, true);
    } else {
      const next = !isChecked;
      setInternalChecked(next);
      onChange?.(value, next);
    }
  };

  return (
    <View className={`${containerClassName}`}>
      <Pressable
        ref={ref}
        onPress={handlePress}
        className="flex-row items-center"
        style={
          Platform.OS === "ios" ? { flexDirection: "row-reverse" } : undefined
        }
        accessible
        accessibilityRole="radio"
        accessibilityState={{ selected: isChecked, disabled: isDisabled }}
        accessibilityLabel={label ?? value}
      >
        <View className={`${radioClassName}`}>
          <RadioInner
            size={size}
            isChecked={isChecked}
            borderColor={borderColor}
            bgColor={bgColor}
          />
        </View>

        {label ? (
          <Text
            className={`${Platform.OS === "ios" ? "mr-2" : "ms-2"} font-dana ${labelClassName} ${
              isDisabled ? "text-gray-400" : "text-gray-800"
            }`}
            style={Platform.OS === "ios" ? { textAlign: "right" } : undefined}
          >
            {label}
          </Text>
        ) : null}
      </Pressable>

      {error ? (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      ) : null}
    </View>
  );
});

Radio.displayName = "Radio";

export default Radio;
