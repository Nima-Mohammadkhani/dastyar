import { Platform, useColorScheme } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",

    primary: {
      50: "#E5F2E9",
      100: "#CAE4D3",
      200: "#B0D7BD",
      300: "#96C9A7",
      400: "#7CBC91",
      500: "#61AE7B",
      600: "#4E9968",
      700: "#417F56",
      800: "#396F4B",
      900: "#315F41",
      950: "#294F36",
    },
    neutral: {
      50: "#FFFFFF",
      100: "#F9F9F9",
      200: "#EDEDED",
      250: "#EBEBE3",
      300: "#E1E1E1",
      400: "#CBCBCB",
      500: "#ADADAD",
      600: "#757575",
      700: "#717171",
      800: "#353535",
      900: "#0C0C0C",
    },
    error: {
      DEFAULT: "#C30000",
      light: "#ED2E2E",
      extralight: "#FFF2F2",
    },
    success: {
      DEFAULT: "#00966D",
      light: "#00BA88",
      extralight: "#F3FDFA",
    },
    warning: {
      DEFAULT: "#A9791C",
      light: "#F4B740",
      extralight: "#FFF8E1",
    },
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#FFFFFF",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FFFFFF",

    primary: {
      50: "#E5F2E9",
      100: "#CAE4D3",
      200: "#B0D7BD",
      300: "#96C9A7",
      400: "#7CBC91",
      500: "#61AE7B",
      600: "#4E9968",
      700: "#417F56",
      800: "#396F4B",
      900: "#315F41",
      950: "#294F36",
    },
    neutral: {
      50: "#FFFFFF",
      100: "#F9F9F9",
      200: "#EDEDED",
      250: "#EBEBE3",
      300: "#E1E1E1",
      400: "#CBCBCB",
      500: "#ADADAD",
      600: "#757575",
      700: "#717171",
      800: "#353535",
      900: "#0C0C0C",
    },
    error: {
      DEFAULT: "#C30000",
      light: "#ED2E2E",
      extralight: "#FFF2F2",
    },
    success: {
      DEFAULT: "#00966D",
      light: "#00BA88",
      extralight: "#F3FDFA",
    },
    warning: {
      DEFAULT: "#A9791C",
      light: "#F4B740",
      extralight: "#FFF8E1",
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const BackgroundImages = {
  light: require("../assets/lightBackground.png"),
  dark: require("../assets/darkBackground.png"),
};

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return {
    colors: isDark ? Colors.dark : Colors.light,
    backgroundImage: isDark ? BackgroundImages.dark : BackgroundImages.light,
    isDark,
  };
}
