export const toPersianNumber = (input: string | number): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let str = input?.toString();

  for (let i = 0; i < 10; i++) {
    str = str?.replace(new RegExp(englishDigits[i], "g"), persianDigits[i]);
  }

  return str;
};

export const toEnglishNumber = (input: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let str = input;

  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(persianDigits[i], "g"), englishDigits[i]);
    str = str.replace(new RegExp(arabicDigits[i], "g"), englishDigits[i]);
  }

  return str;
};

export const toPersianOrdinal = (num: number): string => {
  const ordinals = [
    "", // 0 - not used
    "اول",
    "دوم",
    "سوم",
    "چهارم",
    "پنجم",
    "ششم",
    "هفتم",
    "هشتم",
    "نهم",
    "دهم",
    "یازدهم",
    "دوازدهم",
    "سیزدهم",
    "چهاردهم",
    "پانزدهم",
    "شانزدهم",
    "هفدهم",
    "هجدهم",
    "نوزدهم",
    "بیستم",
  ];

  if (num >= 1 && num <= 20) {
    return ordinals[num];
  }

  // For numbers greater than 20, use the pattern
  if (num > 20) {
    const base = Math.floor(num / 10) * 10;
    const remainder = num % 10;

    const baseNames = {
      20: "بیست",
      30: "سی",
      40: "چهل",
      50: "پنجاه",
      60: "شصت",
      70: "هفتاد",
      80: "هشتاد",
      90: "نود",
    };

    if (remainder === 0) {
      return baseNames[base as keyof typeof baseNames] + "م";
    } else {
      return (
        baseNames[base as keyof typeof baseNames] + " و " + ordinals[remainder]
      );
    }
  }

  return num.toString();
};
