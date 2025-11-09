// Food item validation schemas

import { z } from "zod"

export const foodItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.enum(["dairy", "produce", "meat", "grains", "other"], {
    message: "Please select a valid category",
  }),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unit: z.enum(["g", "kg", "ml", "L", "pieces", "oz", "lbs"], {
    message: "Please select a valid unit",
  }),
  bestBeforeDate: z.string().refine(
    (date) => {
      const parsed = new Date(date)
      return parsed > new Date()
    },
    { message: "Expiration date must be in the future" }
  ),
})

export type FoodItemInput = z.infer<typeof foodItemSchema>
