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

// In-memory store (replaced by database in production)
export let stubItems: StubFoodItem[] = [
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

// Helper functions to manage stub data
export function getStubItems(): StubFoodItem[] {
  return stubItems
}

export function addStubItem(item: StubFoodItem): void {
  stubItems.push(item)
}

export function updateStubItem(id: string, data: Partial<StubFoodItem>): StubFoodItem | null {
  const index = stubItems.findIndex((item) => item.id === id)
  if (index === -1) return null

  stubItems[index] = { ...stubItems[index], ...data }
  return stubItems[index]
}

export function deleteStubItem(id: string): boolean {
  const index = stubItems.findIndex((item) => item.id === id)
  if (index === -1) return false

  stubItems.splice(index, 1)
  return true
}
