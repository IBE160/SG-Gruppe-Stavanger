// Shared in-memory store for sandbox mode
// In production, this would be replaced by a real database

export interface StubFoodItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  bestBeforeDate: string
  createdAt: string
}

// Use global to persist across HMR in dev mode
declare global {
  var __stubItems: StubFoodItem[] | undefined
}

// Initialize default items only once
if (!global.__stubItems) {
  global.__stubItems = [
    {
      id: "1",
      name: "Milk",
      category: "dairy",
      quantity: 1,
      unit: "L",
      bestBeforeDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Cherry Tomatoes",
      category: "produce",
      quantity: 500,
      unit: "g",
      bestBeforeDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Chicken Breast",
      category: "meat",
      quantity: 800,
      unit: "g",
      bestBeforeDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]
}

// Helper functions to manage stub data
export function getStubItems(): StubFoodItem[] {
  return global.__stubItems || []
}

export function addStubItem(item: StubFoodItem): void {
  if (!global.__stubItems) global.__stubItems = []
  global.__stubItems.push(item)
}

export function updateStubItem(id: string, data: Partial<StubFoodItem>): StubFoodItem | null {
  if (!global.__stubItems) {
    console.error("[stubData] No items array found!")
    return null
  }

  const index = global.__stubItems.findIndex((item) => item.id === id)

  if (index === -1) {
    console.error("[stubData] Item not found:", id, "- Available IDs:", global.__stubItems.map(i => i.id))
    return null
  }

  global.__stubItems[index] = { ...global.__stubItems[index], ...data }
  return global.__stubItems[index]
}

export function deleteStubItem(id: string): boolean {
  if (!global.__stubItems) return false

  const index = global.__stubItems.findIndex((item) => item.id === id)

  if (index === -1) return false

  global.__stubItems.splice(index, 1)
  return true
}
