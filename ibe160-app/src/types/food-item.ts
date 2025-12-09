// Food Item types

export interface IFoodItem {
  id: string
  name: string
  category: string
  bestBeforeDate: Date
  quantity: number
  unit: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type CreateFoodItemInput = Omit<IFoodItem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
export type UpdateFoodItemInput = Partial<CreateFoodItemInput>

export const FoodCategory = {
  DAIRY: 'dairy',
  PRODUCE: 'produce',
  MEAT: 'meat',
  GRAINS: 'grains',
  OTHER: 'other',
} as const

export type FoodCategoryType = typeof FoodCategory[keyof typeof FoodCategory]
