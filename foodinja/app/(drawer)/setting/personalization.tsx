import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useState, useEffect, useCallback, memo } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import ScrollDatePicker from "@/components/ui/ScrollDatePicker";
import { toPersianNumber } from "@/utils/converter";

const INGREDIENTS = [
  "گوشت قرمز",
  "مرغ",
  "ماهی",
  "تخم‌مرغ",
  "برنج",
  "ماکارونی",
  "سیب‌زمینی",
  "گوجه",
  "خیار",
  "پیاز",
  "سیر",
  "هویج",
  "کدو",
  "بادمجان",
  "فلفل دلمه‌ای",
  "قارچ",
  "لبنیات",
  "پنیر",
  "ماست",
  "کره",
  "روغن",
  "آرد",
  "شکر",
  "نمک",
  "فلفل",
  "زردچوبه",
  "دارچین",
  "زعفران",
  "رب گوجه",
  "سس گوجه",
  "سس مایونز",
  "خیارشور",
  "زیتون",
  "گردو",
  "بادام",
  "کشمش",
  "خرما",
  "عسل",
  "شکلات",
  "پودر کاکائو",
  "وانیل",
  "خامه",
  "ژلاتین",
];

const DISHES = [
  "قورمه سبزی",
  "فسنجان",
  "زرشک پلو با مرغ",
  "ته چین",
  "لوبیا پلو",
  "عدس پلو",
  "سبزی پلو با ماهی",
  "کشک بادمجان",
  "میرزا قاسمی",
  "بورانی",
  "کوفته تبریزی",
  "دلمه برگ مو",
  "کباب کوبیده",
  "جوجه کباب",
  "چلو گوشت",
  "آبگوشت",
  "کله جوش",
  "شیرین پلو",
  "آلبالو پلو",
  "مرصع پلو",
];

const ToneBottomSheet = memo(
  ({ visible, onClose, selectedTone, onSelect }: any) => {
    const { colors } = useTheme();
    const borderColor = colors.neutral[800];

    return (
      <BottomSheet visible={visible} onClose={onClose}>
        <View className="p-6">
          <Text
            className="font-vazir text-lg mb-4 text-center"
            style={{ color: colors.neutral[50] }}
          >
            سبک و لحن پایه
          </Text>

          {["صمیمی", "رسمی", "خلاق", "ساده و سریع"].map((tone) => (
            <Pressable
              key={tone}
              onPress={() => {
                onSelect(tone);
              }}
            >
              <View
                className="flex-row-reverse justify-between items-center p-4"
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: borderColor,
                  backgroundColor:
                    selectedTone === tone
                      ? colors.primary[900] + "10"
                      : "transparent",
                }}
              >
                <Text
                  className="font-vazir text-base"
                  style={{
                    color:
                      selectedTone === tone
                        ? colors.primary[500]
                        : colors.neutral[50],
                  }}
                >
                  {tone}
                </Text>
                {selectedTone === tone && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary[500]}
                  />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    );
  },
);

const FoodTypeBottomSheet = memo(
  ({ visible, onClose, selectedTypes, onConfirm }: any) => {
    const { colors } = useTheme();
    const cardBg = colors.neutral[800];
    const borderColor = colors.neutral[800];
    const [tempTypes, setTempTypes] = useState<string[]>([]);

    const foodTypes = [
      "غذای اصلی",
      "دسر",
      "شیرینی",
      "نوشیدنی",
      "پیش‌غذا",
      "سوپ",
    ];

    useEffect(() => {
      if (visible) {
        setTempTypes([...selectedTypes]);
      }
    }, [visible]);

    const toggleType = (type: string) => {
      if (tempTypes.includes(type)) {
        setTempTypes(tempTypes.filter((t) => t !== type));
      } else {
        setTempTypes([...tempTypes, type]);
      }
    };

    const handleConfirm = () => {
      onConfirm(tempTypes);
    };

    return (
      <BottomSheet visible={visible} onClose={onClose}>
        <View className="p-6">
          <Text
            className="font-vazir text-lg mb-4 text-center"
            style={{ color: colors.neutral[50] }}
          >
            نوع غذاهای مورد علاقه
          </Text>

          <View className="flex-row-reverse flex-wrap gap-2 mb-6">
            {foodTypes.map((type) => (
              <Pressable key={type} onPress={() => toggleType(type)}>
                <View
                  className="px-4 py-2 rounded-md"
                  style={{
                    backgroundColor: tempTypes.includes(type)
                      ? colors.primary[900]
                      : cardBg,
                    borderWidth: 1,
                    borderColor: tempTypes.includes(type)
                      ? colors.primary[500]
                      : borderColor,
                  }}
                >
                  <Text
                    className="font-vazir text-sm"
                    style={{
                      color: tempTypes.includes(type)
                        ? "white"
                        : colors.neutral[50],
                    }}
                  >
                    {type}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Button
            title="تایید"
            style={{
              backgroundColor: colors.primary[900],
              borderRadius: 8,
            }}
            textStyle={{
              color: "white",
              fontSize: 14,
              fontFamily: "VazirMedium",
            }}
            className="py-3"
            onPress={handleConfirm}
          />
        </View>
      </BottomSheet>
    );
  },
);

const IngredientsBottomSheet = memo(
  ({ visible, onClose, selectedItems, onConfirm }: any) => {
    const { colors } = useTheme();
    const cardBg = colors.neutral[800];
    const borderColor = colors.neutral[800];
    const [tempItems, setTempItems] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
      if (visible) {
        setTempItems([...selectedItems]);
        setSearch("");
      }
    }, [visible]);

    const filteredIngredients = INGREDIENTS.filter((item) =>
      item.includes(search),
    );

    const toggleItem = (item: string) => {
      if (tempItems.includes(item)) {
        setTempItems(tempItems.filter((i) => i !== item));
      } else {
        setTempItems([...tempItems, item]);
      }
    };

    const removeItem = (item: string) => {
      setTempItems(tempItems.filter((i) => i !== item));
    };

    const handleConfirm = () => {
      onConfirm(tempItems);
    };

    return (
      <BottomSheet visible={visible} onClose={onClose}>
        <View className="p-6" style={{ maxHeight: 500 }}>
          <Text
            className="font-vazir text-lg mb-4 text-center"
            style={{ color: colors.neutral[50] }}
          >
            مواد اولیه در دسترس من
          </Text>

          <View
            className="flex-row items-center rounded-md px-3 mb-4"
            style={{
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <Ionicons name="search" size={20} color={colors.neutral[400]} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="جستجوی مواد اولیه..."
              placeholderTextColor={colors.neutral[400]}
              className="flex-1 font-vazir text-base p-3"
              style={{ color: colors.neutral[50] }}
            />
          </View>

          {tempItems.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {tempItems.map((item) => (
                <View
                  key={item}
                  className="flex-row items-center gap-1 px-3 py-1.5 rounded-md"
                  style={{
                    backgroundColor: colors.primary[900] + "20",
                    borderWidth: 1,
                    borderColor: colors.primary[500],
                  }}
                >
                  <Text
                    className="font-vazir text-sm"
                    style={{ color: colors.primary[500] }}
                  >
                    {item}
                  </Text>
                  <Pressable onPress={() => removeItem(item)}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.primary[500]}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <ScrollView style={{ maxHeight: 300 }}>
            {filteredIngredients.map((item) => (
              <Pressable key={item} onPress={() => toggleItem(item)}>
                <View
                  className="flex-row-reverse justify-between items-center p-4"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: tempItems.includes(item)
                      ? colors.primary[900] + "10"
                      : "transparent",
                  }}
                >
                  <Text
                    className="font-vazir text-base"
                    style={{
                      color: tempItems.includes(item)
                        ? colors.primary[500]
                        : colors.neutral[50],
                    }}
                  >
                    {item}
                  </Text>

                  {tempItems.includes(item) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary[500]}
                    />
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Button
            title="تایید"
            style={{
              backgroundColor: colors.primary[900],
              borderRadius: 8,
              marginTop: 16,
            }}
            textStyle={{
              color: "white",
              fontSize: 14,
              fontFamily: "VazirMedium",
            }}
            className="py-3"
            onPress={handleConfirm}
          />
        </View>
      </BottomSheet>
    );
  },
);

const DishesBottomSheet = memo(
  ({ visible, onClose, selectedItems, onConfirm }: any) => {
    const { colors } = useTheme();
    const cardBg = colors.neutral[800];
    const borderColor = colors.neutral[800];
    const [tempItems, setTempItems] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
      if (visible) {
        setTempItems([...selectedItems]);
        setSearch("");
      }
    }, [visible]);

    const filteredDishes = DISHES.filter((item) => item.includes(search));

    const toggleItem = (item: string) => {
      if (tempItems.includes(item)) {
        setTempItems(tempItems.filter((i) => i !== item));
      } else {
        setTempItems([...tempItems, item]);
      }
    };

    const removeItem = (item: string) => {
      setTempItems(tempItems.filter((i) => i !== item));
    };

    const handleConfirm = () => {
      onConfirm(tempItems);
    };

    return (
      <BottomSheet visible={visible} onClose={onClose}>
        <View className="p-6" style={{ maxHeight: 500 }}>
          <Text
            className="font-vazir text-lg mb-4 text-center"
            style={{ color: colors.neutral[50] }}
          >
            غذاهای مورد علاقه من
          </Text>

          <View
            className="flex-row items-center rounded-md px-3 mb-4"
            style={{
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <Ionicons name="search" size={20} color={colors.neutral[400]} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="جستجوی غذاها..."
              placeholderTextColor={colors.neutral[400]}
              className="flex-1 font-vazir text-base p-3"
              style={{ color: colors.neutral[50] }}
            />
          </View>

          {tempItems.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {tempItems.map((item) => (
                <View
                  key={item}
                  className="flex-row items-center gap-1 px-3 py-1.5 rounded-md"
                  style={{
                    backgroundColor: colors.primary[900] + "20",
                    borderWidth: 1,
                    borderColor: colors.primary[500],
                  }}
                >
                  <Text
                    className="font-vazir text-sm"
                    style={{ color: colors.primary[500] }}
                  >
                    {item}
                  </Text>
                  <Pressable onPress={() => removeItem(item)}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.primary[500]}
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <ScrollView style={{ maxHeight: 300 }}>
            {filteredDishes.map((item) => (
              <Pressable key={item} onPress={() => toggleItem(item)}>
                <View
                  className="flex-row-reverse justify-between items-center p-4"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: tempItems.includes(item)
                      ? colors.primary[900] + "10"
                      : "transparent",
                  }}
                >
                  <Text
                    className="font-vazir text-base"
                    style={{
                      color: tempItems.includes(item)
                        ? colors.primary[500]
                        : colors.neutral[50],
                    }}
                  >
                    {item}
                  </Text>

                  {tempItems.includes(item) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary[500]}
                    />
                  )}
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <Button
            title="تایید"
            style={{
              backgroundColor: colors.primary[900],
              borderRadius: 8,
              marginTop: 16,
            }}
            textStyle={{
              color: "white",
              fontSize: 14,
              fontFamily: "VazirMedium",
            }}
            className="py-3"
            onPress={handleConfirm}
          />
        </View>
      </BottomSheet>
    );
  },
);

const TimeBottomSheet = memo(
  ({ visible, onClose, initialTime, onConfirm }: any) => {
    const { colors, isDark } = useTheme();
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
      if (visible) {
        setHours(Math.floor(initialTime / 60));
        setMinutes(initialTime % 60);
      }
    }, [visible]);

    const handleTimeChange = (h: number, m: number) => {
      setHours(h);
      setMinutes(m);
    };

    const handleConfirm = () => {
      onConfirm(hours * 60 + minutes);
    };

    return (
      <BottomSheet visible={visible} onClose={onClose}>
        <View className="p-6">
          <Text
            className="font-vazir text-lg mb-4 text-center"
            style={{ color: colors.neutral[50] }}
          >
            چقدر زمان برای آشپزی دارم؟
          </Text>

          <View className="mb-6">
            <ScrollDatePicker
              onTimeChange={handleTimeChange}
              initialHours={hours}
              initialMinutes={minutes}
            />
          </View>

          <View className="flex-row gap-3">
            <Button
              title="تایید"
              style={{
                backgroundColor: colors.primary[900],
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: "white",
                fontSize: 14,
                fontFamily: "VazirMedium",
              }}
              className="py-3"
              onPress={handleConfirm}
            />
            <Button
              title="لغو"
              style={{
                backgroundColor: colors.neutral[50],
                borderRadius: 8,
                flex: 1,
              }}
              textStyle={{
                color: isDark ? "black" : "white",
                fontSize: 14,
                fontFamily: "VazirMedium",
              }}
              className="py-3"
              onPress={onClose}
            />
          </View>
        </View>
      </BottomSheet>
    );
  },
);

const Personalize = () => {
  const { colors, isDark } = useTheme();
  const [hasAnimated, setHasAnimated] = useState(false);

  const [selectedTone, setSelectedTone] = useState("صمیمی");
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([
    "غذای اصلی",
  ]);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([
    "برنج",
    "مرغ",
    "گوجه",
  ]);
  const [favoriteDishes, setFavoriteDishes] = useState<string[]>([
    "قورمه سبزی",
    "زرشک پلو با مرغ",
  ]);
  const [cookingTime, setCookingTime] = useState(30);

  const [toneSheet, setToneSheet] = useState(false);
  const [foodTypeSheet, setFoodTypeSheet] = useState(false);
  const [ingredientsSheet, setIngredientsSheet] = useState(false);
  const [dishesSheet, setDishesSheet] = useState(false);
  const [timeSheet, setTimeSheet] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
  const borderColor = isDark ? colors.neutral[800] : colors.neutral[200];

  const DataBox = ({ children, className = "" }: any) => (
    <MotiView
      from={hasAnimated ? undefined : { opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay: 200 }}
      className={`rounded-md overflow-hidden mb-4 ${className}`}
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      {children}
    </MotiView>
  );

  const DataRow = ({ children, onPress, showBorder = true }: any) => (
    <Pressable onPress={onPress}>
      <View className="relative">
        <View className="p-4">{children}</View>
        {showBorder && (
          <View
            className="w-full h-px absolute bottom-0 left-0 right-0"
            style={{ backgroundColor: borderColor }}
          />
        )}
      </View>
    </Pressable>
  );

  const SelectedItems = ({ items }: { items: string[] }) => (
    <View className="flex-row justify-end items-end flex-wrap gap-2 mt-2 w-80">
      {items.map((item, index) => (
        <MotiView
          key={item}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 300, delay: index * 50 }}
          className="px-3 py-1.5 rounded-md"
          style={{
            backgroundColor: colors.primary[900] + "20",
            borderWidth: 1,
            borderColor: colors.primary[500],
          }}
        >
          <Text
            className="font-vazir text-sm"
            style={{ color: colors.primary[500] }}
          >
            {item}
          </Text>
        </MotiView>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <MotiView
          from={hasAnimated ? undefined : { opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: 100 }}
          className="items-center mb-8"
        >
          <Text
            className="font-vazir text-3xl"
            style={{ color: colors.neutral[50] }}
          >
            شخصی‌{" "}
            <Text className="font-vazir" style={{ color: colors.primary[900] }}>
              سازی
            </Text>
          </Text>
          <Text
            className="font-vazir text-sm mt-2 text-center"
            style={{ color: colors.neutral[400] }}
          >
            تجربه فودینجا رو برای خودت خاص کن
          </Text>
        </MotiView>

        <DataBox>
          <DataRow onPress={() => setToneSheet(true)}>
            <View className="flex-row-reverse justify-between items-center">
              <View className="flex flex-col justify-end items-end">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  سبک و لحن پایه
                </Text>
                <Text
                  className="font-vazir text-xs mt-1"
                  style={{ color: colors.neutral[400] }}
                >
                  {selectedTone}
                </Text>
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.neutral[400]}
              />
            </View>
          </DataRow>
          <View className="p-4">
            <Text
              className="font-vazir text-xs"
              style={{
                color: colors.neutral[400],
                lineHeight: 20,
                direction: "rtl",
              }}
            >
              این صدا و لحن اصلی است که فودینجا در مکالمات شما استفاده میکنند.
              این موضوع بر قابلیت‌های فودینجا تاثیر ندارد.
            </Text>
          </View>
        </DataBox>

        <DataBox>
          <DataRow onPress={() => setFoodTypeSheet(true)}>
            <View className="flex-row-reverse justify-between items-center">
              <View className="flex flex-col justify-end items-end">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  نوع غذاهای مورد علاقه
                </Text>
                <SelectedItems items={selectedFoodTypes} />
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.neutral[400]}
              />
            </View>
          </DataRow>
        </DataBox>

        <DataBox>
          <DataRow onPress={() => setIngredientsSheet(true)}>
            <View className="flex-row-reverse justify-between items-center">
              <View className="flex flex-col justify-end items-end">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  مواد اولیه در دسترس من
                </Text>
                <SelectedItems items={availableIngredients} />
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.neutral[400]}
              />
            </View>
          </DataRow>
        </DataBox>

        <DataBox>
          <DataRow onPress={() => setDishesSheet(true)}>
            <View className="flex-row-reverse justify-between items-center">
              <View className="flex flex-col justify-end items-end">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  غذاهای مورد علاقه من
                </Text>
                <SelectedItems items={favoriteDishes} />
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.neutral[400]}
              />
            </View>
          </DataRow>
        </DataBox>

        <DataBox>
          <DataRow onPress={() => setTimeSheet(true)} showBorder={false}>
            <View className="flex-row-reverse justify-between items-center">
              <View className="flex flex-col justify-end items-end">
                <Text
                  className="font-vazir text-base"
                  style={{ color: colors.neutral[50] }}
                >
                  چقدر تایم دارم برای آشپزی
                </Text>
                <Text
                  className="font-vazir text-xs mt-1"
                  style={{ color: colors.neutral[400] }}
                >
                  {Math.floor(cookingTime / 60) > 0
                    ? `${toPersianNumber(Math.floor(cookingTime / 60))} ساعت و ${toPersianNumber(cookingTime % 60)} دقیقه`
                    : `${toPersianNumber(cookingTime)} دقیقه`}
                </Text>
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.neutral[400]}
              />
            </View>
          </DataRow>
        </DataBox>
      </ScrollView>

      <ToneBottomSheet
        visible={toneSheet}
        onClose={() => setToneSheet(false)}
        selectedTone={selectedTone}
        onSelect={(tone: string) => {
          setSelectedTone(tone);
          setToneSheet(false);
        }}
      />

      <FoodTypeBottomSheet
        visible={foodTypeSheet}
        onClose={() => setFoodTypeSheet(false)}
        selectedTypes={selectedFoodTypes}
        onConfirm={(types: string[]) => {
          setSelectedFoodTypes(types);
          setFoodTypeSheet(false);
        }}
      />

      <IngredientsBottomSheet
        visible={ingredientsSheet}
        onClose={() => setIngredientsSheet(false)}
        selectedItems={availableIngredients}
        onConfirm={(items: string[]) => {
          setAvailableIngredients(items);
          setIngredientsSheet(false);
        }}
      />

      <DishesBottomSheet
        visible={dishesSheet}
        onClose={() => setDishesSheet(false)}
        selectedItems={favoriteDishes}
        onConfirm={(items: string[]) => {
          setFavoriteDishes(items);
          setDishesSheet(false);
        }}
      />

      <TimeBottomSheet
        visible={timeSheet}
        onClose={() => setTimeSheet(false)}
        initialTime={cookingTime}
        onConfirm={(time: number) => {
          setCookingTime(time);
          setTimeSheet(false);
        }}
      />
    </SafeAreaView>
  );
};

export default Personalize;
