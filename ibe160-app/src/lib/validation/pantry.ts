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
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset to start of day
      return parsed >= today
    },
    { message: "Expiration date cannot be in the past" }
  ),
})

export type FoodItemInput = z.infer<typeof foodItemSchema>
