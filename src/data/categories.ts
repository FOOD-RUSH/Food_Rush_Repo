export interface Category {
  value: string;
  label: string;
  emoji: string;
  image?: string;
  color: string;
  description?: string;
}

export const FOOD_CATEGORIES: Category[] = [
  {
    value: "local-dishes",
    label: "Local Dishes",
    emoji: "🍲",
    color: "#FF6B35",
    description: "Traditional and regional cuisine"
  },
  {
    value: "breakfast",
    label: "Breakfast",
    emoji: "🥞",
    color: "#FFD93D",
    description: "Morning meals and breakfast items"
  },
  {
    value: "fastfood",
    label: "Fast Food",
    emoji: "🍔",
    color: "#FF3B30",
    description: "Quick service meals and burgers"
  },
  {
    value: "desserts",
    label: "Desserts",
    emoji: "🍰",
    color: "#FF69B4",
    description: "Sweet treats and desserts"
  },
  {
    value: "snacks",
    label: "Snacks",
    emoji: "🍿",
    color: "#FF9500",
    description: "Light bites and snack foods"
  },
  {
    value: "drinks",
    label: "Drinks",
    emoji: "🥤",
    color: "#007AFF",
    description: "Beverages and refreshments"
  },
  {
    value: "vegetarian",
    label: "Vegetarian",
    emoji: "🥗",
    color: "#34C759",
    description: "Plant-based and vegetarian options"
  }
];

// Helper functions
export const getCategoryByValue = (value: string): Category | undefined => {
  return FOOD_CATEGORIES.find(category => category.value === value);
};

export const getCategoryByLabel = (label: string): Category | undefined => {
  return FOOD_CATEGORIES.find(category => category.label.toLowerCase() === label.toLowerCase());
};

export const getAllCategories = (): Category[] => {
  return FOOD_CATEGORIES;
};

export const getCategoryEmoji = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.emoji || "🍽️";
};

export const getCategoryColor = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.color || "#666666";
};

export const getCategoryLabel = (value: string): string => {
  const category = getCategoryByValue(value);
  return category?.label || value;
};

// For backward compatibility with existing translation keys
export const CATEGORY_TRANSLATION_MAP: Record<string, string> = {
  "local-dishes": "category_local_dishes",
  "breakfast": "category_breakfast", 
  "fastfood": "category_fast_food",
  "desserts": "category_desserts",
  "snacks": "category_snacks",
  "drinks": "category_drinks",
  "vegetarian": "category_vegetarian"
};

export const getCategoryTranslationKey = (value: string): string => {
  return CATEGORY_TRANSLATION_MAP[value] || value;
};