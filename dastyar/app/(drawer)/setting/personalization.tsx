import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/theme";
import BottomSheet from "@/components/ui/BottomSheet";
import Button from "@/components/ui/Button";
import ScrollDatePicker from "@/components/ui/ScrollDatePicker";
import { toPersianNumber } from "@/utils/converter";
import {
  useGetPersonalizationQuery,
  useUpdatePersonalizationMutation,
  useGetIngredientsQuery,
  useGetDishesQuery,
  useGetFoodTypesQuery,
  useGetTonesQuery,
} from "@/redux/service/app";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const ToneBottomSheet = memo(
  ({ visible, onClose, selectedToneId, onSelect, tones }: any) => {
    const { isDark } = useTheme();
    const { colors } = useTheme();
    const borderColor = isDark ? "#1C1C1E" : "#F5F5F5";

    if (!tones || tones.length === 0) {
      return (
        <BottomSheet visible={visible} onClose={onClose}>
          <View className="p-6 items-center">
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text className="font-vazir text-sm mt-4" style={{ color: colors.neutral[400] }}>
              در حال بارگذاری...
            </Text>
          </View>
        </BottomSheet>
      );
    }

    return (
      <BottomSheet visible={visible} onClose={onClose}>
        <View className="p-6">
          <Text
            className="font-vazir text-lg mb-4 text-center"
            style={{ color: colors.neutral[50] }}
          >
            سبک و لحن پایه
          </Text>

          {tones.map((tone: any) => (
            <Pressable
              key={tone.id}
              onPress={() => {
                onSelect(tone.id);
              }}
            >
              <View
                className="flex-row-reverse justify-between items-center p-4"
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: borderColor,
                  backgroundColor:
                    selectedToneId === tone.id
                      ? colors.primary[900] + "10"
                      : "transparent",
                }}
              >
                <Text
                  className="font-vazir text-base"
                  style={{
                    color:
                      selectedToneId === tone.id
                        ? colors.primary[500]
                        : colors.neutral[50],
                  }}
                >
                  {tone.name}
                </Text>
                {selectedToneId === tone.id && (
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
  ({ visible, onClose, selectedTypeIds, onConfirm, foodTypes }: any) => {
    const { colors } = useTheme();
    const { isDark } = useTheme();
    const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
    const borderColor = isDark ? "#1C1C1E" : "#F5F5F5";
    const [tempTypeIds, setTempTypeIds] = useState<number[]>([]);

    useEffect(() => {
      if (visible) {
        setTempTypeIds([...selectedTypeIds]);
      }
    }, [visible, selectedTypeIds]);

    const toggleType = (typeId: number) => {
      if (tempTypeIds.includes(typeId)) {
        setTempTypeIds(tempTypeIds.filter((id) => id !== typeId));
      } else {
        setTempTypeIds([...tempTypeIds, typeId]);
      }
    };

    const handleConfirm = () => {
      onConfirm(tempTypeIds);
    };

    if (!foodTypes || foodTypes.length === 0) {
      return (
        <BottomSheet visible={visible} onClose={onClose}>
          <View className="p-6 items-center">
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text className="font-vazir text-sm mt-4" style={{ color: colors.neutral[400] }}>
              در حال بارگذاری...
            </Text>
          </View>
        </BottomSheet>
      );
    }

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
            {foodTypes.map((type: any) => (
              <Pressable key={type.id} onPress={() => toggleType(type.id)}>
                <View
                  className="px-4 py-2 rounded-md"
                  style={{
                    backgroundColor: tempTypeIds.includes(type.id)
                      ? colors.primary[900]
                      : cardBg,
                    borderWidth: 1,
                    borderColor: tempTypeIds.includes(type.id)
                      ? colors.primary[500]
                      : borderColor,
                  }}
                >
                  <Text
                    className="font-vazir text-sm"
                    style={{
                      color: tempTypeIds.includes(type.id)
                        ? "white"
                        : colors.neutral[50],
                    }}
                  >
                    {type.name}
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
  ({ visible, onClose, selectedIngredientIds, onConfirm, ingredients }: any) => {
    const { colors } = useTheme();
    const { isDark } = useTheme();
    const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
    const borderColor = isDark ? "#1C1C1E" : "#F5F5F5";
    const [tempIngredientIds, setTempIngredientIds] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
      if (visible) {
        setTempIngredientIds([...selectedIngredientIds]);
        setSearch("");
      }
    }, [visible, selectedIngredientIds]);

    const filteredIngredients = useMemo(() => {
      if (!ingredients) return [];
      return ingredients.filter((ing: any) =>
        ing.name.includes(search),
      );
    }, [ingredients, search]);

    const toggleItem = (ingredientId: number) => {
      if (tempIngredientIds.includes(ingredientId)) {
        setTempIngredientIds(tempIngredientIds.filter((id) => id !== ingredientId));
      } else {
        setTempIngredientIds([...tempIngredientIds, ingredientId]);
      }
    };

    const removeItem = (ingredientId: number) => {
      setTempIngredientIds(tempIngredientIds.filter((id) => id !== ingredientId));
    };

    const handleConfirm = () => {
      onConfirm(tempIngredientIds);
    };

    if (!ingredients || ingredients.length === 0) {
      return (
        <BottomSheet visible={visible} onClose={onClose}>
          <View className="p-6 items-center">
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text className="font-vazir text-sm mt-4" style={{ color: colors.neutral[400] }}>
              در حال بارگذاری...
            </Text>
          </View>
        </BottomSheet>
      );
    }

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

          {tempIngredientIds.length > 0 && (
            <View className="flex-row-reverse flex-wrap gap-2 mb-4">
              {tempIngredientIds.map((id) => {
                const ingredient = ingredients.find((ing: any) => ing.id === id);
                if (!ingredient) return null;
                return (
                  <View
                    key={id}
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
                      {ingredient.name}
                    </Text>
                    <Pressable onPress={() => removeItem(id)}>
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={colors.primary[500]}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          <ScrollView style={{ maxHeight: 300 }}>
            {filteredIngredients.map((ingredient: any) => (
              <Pressable key={ingredient.id} onPress={() => toggleItem(ingredient.id)}>
                <View
                  className="flex-row-reverse justify-between items-center p-4"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: tempIngredientIds.includes(ingredient.id)
                      ? colors.primary[900] + "10"
                      : "transparent",
                  }}
                >
                  <Text
                    className="font-vazir text-base"
                    style={{
                      color: tempIngredientIds.includes(ingredient.id)
                        ? colors.primary[500]
                        : colors.neutral[50],
                    }}
                  >
                    {ingredient.name}
                  </Text>

                  {tempIngredientIds.includes(ingredient.id) && (
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
  ({ visible, onClose, selectedDishIds, onConfirm, dishes }: any) => {
    const { colors } = useTheme();
    const { isDark } = useTheme();
    const cardBg = isDark ? "#1C1C1E" : "#F5F5F5";
    const borderColor = isDark ? "#1C1C1E" : "#F5F5F5";
    const [tempDishIds, setTempDishIds] = useState<number[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
      if (visible) {
        setTempDishIds([...selectedDishIds]);
        setSearch("");
      }
    }, [visible, selectedDishIds]);

    const filteredDishes = useMemo(() => {
      if (!dishes) return [];
      return dishes.filter((dish: any) => dish.name.includes(search));
    }, [dishes, search]);

    const toggleItem = (dishId: number) => {
      if (tempDishIds.includes(dishId)) {
        setTempDishIds(tempDishIds.filter((id) => id !== dishId));
      } else {
        setTempDishIds([...tempDishIds, dishId]);
      }
    };

    const removeItem = (dishId: number) => {
      setTempDishIds(tempDishIds.filter((id) => id !== dishId));
    };

    const handleConfirm = () => {
      onConfirm(tempDishIds);
    };

    if (!dishes || dishes.length === 0) {
      return (
        <BottomSheet visible={visible} onClose={onClose}>
          <View className="p-6 items-center">
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text className="font-vazir text-sm mt-4" style={{ color: colors.neutral[400] }}>
              در حال بارگذاری...
            </Text>
          </View>
        </BottomSheet>
      );
    }

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

          {tempDishIds.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {tempDishIds.map((id) => {
                const dish = dishes.find((d: any) => d.id === id);
                if (!dish) return null;
                return (
                  <View
                    key={id}
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
                      {dish.name}
                    </Text>
                    <Pressable onPress={() => removeItem(id)}>
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={colors.primary[500]}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}

          <ScrollView style={{ maxHeight: 300 }}>
            {filteredDishes.map((dish: any) => (
              <Pressable key={dish.id} onPress={() => toggleItem(dish.id)}>
                <View
                  className="flex-row-reverse justify-between items-center p-4"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: tempDishIds.includes(dish.id)
                      ? colors.primary[900] + "10"
                      : "transparent",
                  }}
                >
                  <Text
                    className="font-vazir text-base"
                    style={{
                      color: tempDishIds.includes(dish.id)
                        ? colors.primary[500]
                        : colors.neutral[50],
                    }}
                  >
                    {dish.name}
                  </Text>

                  {tempDishIds.includes(dish.id) && (
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
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // API Queries
  const { data: personalizationData, isLoading: isLoadingPersonalization } = useGetPersonalizationQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: ingredientsData, isLoading: isLoadingIngredients } = useGetIngredientsQuery();
  const { data: dishesData, isLoading: isLoadingDishes } = useGetDishesQuery();
  const { data: foodTypesData, isLoading: isLoadingFoodTypes } = useGetFoodTypesQuery();
  const { data: tonesData, isLoading: isLoadingTones } = useGetTonesQuery();
  const [updatePersonalization, { isLoading: isUpdating }] = useUpdatePersonalizationMutation();

  // State
  const [selectedToneId, setSelectedToneId] = useState<number | null>(null);
  const [selectedFoodTypeIds, setSelectedFoodTypeIds] = useState<number[]>([]);
  const [availableIngredientIds, setAvailableIngredientIds] = useState<number[]>([]);
  const [favoriteDishIds, setFavoriteDishIds] = useState<number[]>([]);
  const [cookingTime, setCookingTime] = useState<number | null>(null);

  const [toneSheet, setToneSheet] = useState(false);
  const [foodTypeSheet, setFoodTypeSheet] = useState(false);
  const [ingredientsSheet, setIngredientsSheet] = useState(false);
  const [dishesSheet, setDishesSheet] = useState(false);
  const [timeSheet, setTimeSheet] = useState(false);

  // Load personalization settings from API
  useEffect(() => {
    if (personalizationData) {
      setSelectedToneId(personalizationData.tone_id);
      setSelectedFoodTypeIds(personalizationData.food_type_ids || []);
      setAvailableIngredientIds(personalizationData.available_ingredient_ids || []);
      setFavoriteDishIds(personalizationData.favorite_dish_ids || []);
      setCookingTime(personalizationData.cooking_time);
    }
  }, [personalizationData]);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  // Helper functions to get names from IDs
  const getToneName = useCallback((toneId: number | null) => {
    if (!toneId || !tonesData?.tones) return "انتخاب نشده";
    const tone = tonesData.tones.find((t) => t.id === toneId);
    return tone?.name || "انتخاب نشده";
  }, [tonesData]);

  const getFoodTypeNames = useCallback((ids: number[]) => {
    if (!foodTypesData?.food_types) return [];
    return ids.map((id) => {
      const type = foodTypesData.food_types.find((t) => t.id === id);
      return type?.name || "";
    }).filter(Boolean);
  }, [foodTypesData]);

  const getIngredientNames = useCallback((ids: number[]) => {
    if (!ingredientsData?.ingredients) return [];
    return ids.map((id) => {
      const ingredient = ingredientsData.ingredients.find((i) => i.id === id);
      return ingredient?.name || "";
    }).filter(Boolean);
  }, [ingredientsData]);

  const getDishNames = useCallback((ids: number[]) => {
    if (!dishesData?.dishes) return [];
    return ids.map((id) => {
      const dish = dishesData.dishes.find((d) => d.id === id);
      return dish?.name || "";
    }).filter(Boolean);
  }, [dishesData]);

  // Save changes to API
  const handleSave = useCallback(async () => {
    if (!isAuthenticated) {
      Alert.alert("خطا", "لطفا ابتدا وارد شوید");
      return;
    }

    try {
      await updatePersonalization({
        tone_id: selectedToneId || undefined,
        food_type_ids: selectedFoodTypeIds.length > 0 ? selectedFoodTypeIds : undefined,
        available_ingredient_ids: availableIngredientIds.length > 0 ? availableIngredientIds : undefined,
        favorite_dish_ids: favoriteDishIds.length > 0 ? favoriteDishIds : undefined,
        cooking_time: cookingTime || undefined,
      }).unwrap();
      Alert.alert("موفق", "تنظیمات با موفقیت ذخیره شد");
    } catch (error: any) {
      console.error("Error updating personalization:", error);
      Alert.alert("خطا", error?.data?.message || "ذخیره تنظیمات ناموفق بود");
    }
  }, [isAuthenticated, updatePersonalization, selectedToneId, selectedFoodTypeIds, availableIngredientIds, favoriteDishIds, cookingTime]);

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
      {items.length === 0 ? (
        <Text className="font-vazir text-xs" style={{ color: colors.neutral[400] }}>
          انتخاب نشده
        </Text>
      ) : (
        items.map((item, index) => (
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
        ))
      )}
    </View>
  );

  const isLoading = isLoadingPersonalization || isLoadingIngredients || isLoadingDishes || isLoadingFoodTypes || isLoadingTones;

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="font-vazir text-lg text-center" style={{ color: colors.neutral[50] }}>
            لطفا ابتدا وارد شوید
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text className="font-vazir text-sm mt-4" style={{ color: colors.neutral[400] }}>
            در حال بارگذاری...
          </Text>
        </View>
      ) : (
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
            تجربه دستیار رو برای خودت شخصی کن
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
                  {getToneName(selectedToneId)}
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
              این صدا و لحن اصلی است که دستیار در مکالمات شما استفاده می‌کند.
              این موضوع بر قابلیت‌های دستیار تاثیر ندارد.
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
                <SelectedItems items={getFoodTypeNames(selectedFoodTypeIds)} />
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
                <SelectedItems items={getIngredientNames(availableIngredientIds)} />
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
                <SelectedItems items={getDishNames(favoriteDishIds)} />
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
                  {cookingTime
                    ? Math.floor(cookingTime / 60) > 0
                      ? `${toPersianNumber(Math.floor(cookingTime / 60))} ساعت و ${toPersianNumber(cookingTime % 60)} دقیقه`
                      : `${toPersianNumber(cookingTime)} دقیقه`
                    : "انتخاب نشده"}
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

        <View className="mb-8 mt-4">
          <Button
            title={isUpdating ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            style={{
              backgroundColor: colors.primary[900],
              borderRadius: 8,
            }}
            textStyle={{
              color: "white",
              fontSize: 16,
              fontFamily: "VazirMedium",
            }}
            className="py-3"
            onPress={handleSave}
            disabled={isUpdating}
          />
        </View>
      </ScrollView>
      )}

      <ToneBottomSheet
        visible={toneSheet}
        onClose={() => setToneSheet(false)}
        selectedToneId={selectedToneId}
        onSelect={(toneId: number) => {
          setSelectedToneId(toneId);
          setToneSheet(false);
          handleSave();
        }}
        tones={tonesData?.tones}
      />

      <FoodTypeBottomSheet
        visible={foodTypeSheet}
        onClose={() => setFoodTypeSheet(false)}
        selectedTypeIds={selectedFoodTypeIds}
        onConfirm={(typeIds: number[]) => {
          setSelectedFoodTypeIds(typeIds);
          setFoodTypeSheet(false);
          handleSave();
        }}
        foodTypes={foodTypesData?.food_types}
      />

      <IngredientsBottomSheet
        visible={ingredientsSheet}
        onClose={() => setIngredientsSheet(false)}
        selectedIngredientIds={availableIngredientIds}
        onConfirm={(ingredientIds: number[]) => {
          setAvailableIngredientIds(ingredientIds);
          setIngredientsSheet(false);
          handleSave();
        }}
        ingredients={ingredientsData?.ingredients}
      />

      <DishesBottomSheet
        visible={dishesSheet}
        onClose={() => setDishesSheet(false)}
        selectedDishIds={favoriteDishIds}
        onConfirm={(dishIds: number[]) => {
          setFavoriteDishIds(dishIds);
          setDishesSheet(false);
          handleSave();
        }}
        dishes={dishesData?.dishes}
      />

      <TimeBottomSheet
        visible={timeSheet}
        onClose={() => setTimeSheet(false)}
        initialTime={cookingTime || 0}
        onConfirm={(time: number) => {
          setCookingTime(time);
          setTimeSheet(false);
          handleSave();
        }}
      />
    </SafeAreaView>
  );
};

export default Personalize;
