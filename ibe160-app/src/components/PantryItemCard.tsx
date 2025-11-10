// PantryItemCard component for displaying food items with images

import { AlertTriangle } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  bestBeforeDate: string
  createdAt: string
}

interface PantryItemCardProps {
  item: FoodItem
  onEdit?: (item: FoodItem) => void
  onDelete?: (item: FoodItem) => void
}

export function PantryItemCard({ item, onEdit, onDelete }: PantryItemCardProps) {
  // Calculate days until expiration
  const daysUntilExpiry = Math.ceil(
    (new Date(item.bestBeforeDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const isExpiringSoon = daysUntilExpiry <= 3

  // Format expiration date
  const expiryDate = new Date(item.bestBeforeDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  // Generate image URL from Unsplash based on item name
  const getImageUrl = (name: string) => {
    const query = encodeURIComponent(name.toLowerCase())
    return `https://images.unsplash.com/photo-1${Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 100000000}?w=200&h=200&fit=crop&q=80`
  }

  // Fallback gradient based on category
  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "dairy":
        return "from-blue-100 to-blue-200"
      case "produce":
        return "from-green-100 to-green-200"
      case "meat":
        return "from-red-100 to-red-200"
      case "grains":
        return "from-yellow-100 to-yellow-200"
      default:
        return "from-gray-100 to-gray-200"
    }
  }

  // Map common food names to Unsplash photo IDs (including Norwegian names)
  const foodImageMap: Record<string, string> = {
    // Dairy / Meieri
    "milk": "photo-1563636619-e9143da7973b",
    "melk": "photo-1563636619-e9143da7973b",
    "cheese": "photo-1486297678162-eb2a19b0a32d",
    "ost": "photo-1486297678162-eb2a19b0a32d",
    "yogurt": "photo-1488477181946-6428a0291777",
    "yoghurt": "photo-1488477181946-6428a0291777",
    "butter": "photo-1589985270826-4b7bb135bc9d",
    "smør": "photo-1589985270826-4b7bb135bc9d",

    // Vegetables / Grønnsaker
    "tomato": "photo-1592924357228-91a4daadcfea",
    "tomatoes": "photo-1592924357228-91a4daadcfea",
    "tomat": "photo-1592924357228-91a4daadcfea",
    "tomater": "photo-1592924357228-91a4daadcfea",
    "cherry tomatoes": "photo-1606923829579-0cb981a83e2e",
    "kirsebærtomater": "photo-1606923829579-0cb981a83e2e",
    "lettuce": "photo-1622206151226-18ca2c9ab4a1",
    "salat": "photo-1622206151226-18ca2c9ab4a1",
    "carrot": "photo-1598170845058-32b9d6a5da37",
    "carrots": "photo-1598170845058-32b9d6a5da37",
    "gulrot": "photo-1598170845058-32b9d6a5da37",
    "gulrøtter": "photo-1598170845058-32b9d6a5da37",
    "onion": "photo-1508747703725-719777637510",
    "løk": "photo-1508747703725-719777637510",
    "potato": "photo-1518977676601-b53f82aba655",
    "potatoes": "photo-1518977676601-b53f82aba655",
    "potet": "photo-1518977676601-b53f82aba655",
    "poteter": "photo-1518977676601-b53f82aba655",
    "broccoli": "photo-1628773822503-930a7eaecf80",
    "brokkoli": "photo-1628773822503-930a7eaecf80",
    "cucumber": "photo-1568584711271-81773473f986",
    "cucumbers": "photo-1568584711271-81773473f986",
    "agurk": "photo-1568584711271-81773473f986",
    "bell pepper": "photo-1563565375-f3fdfdbefa83",
    "bell peppers": "photo-1563565375-f3fdfdbefa83",
    "paprika": "photo-1563565375-f3fdfdbefa83",
    "pepper": "photo-1563565375-f3fdfdbefa83",
    "peppers": "photo-1563565375-f3fdfdbefa83",
    "zucchini": "photo-1594759481664-96ced6efee0e",
    "squash": "photo-1594759481664-96ced6efee0e",
    "eggplant": "photo-1618492424367-16f5fd97ba07",
    "aubergine": "photo-1618492424367-16f5fd97ba07",
    "spinach": "photo-1576045057995-568f588f82fb",
    "spinat": "photo-1576045057995-568f588f82fb",
    "mushroom": "photo-1515664069124-6a81e6be4adb",
    "mushrooms": "photo-1515664069124-6a81e6be4adb",
    "sopp": "photo-1515664069124-6a81e6be4adb",
    "champignon": "photo-1515664069124-6a81e6be4adb",
    "garlic": "photo-1591679252260-1d5b30d5bab2",
    "hvitløk": "photo-1591679252260-1d5b30d5bab2",
    "corn": "photo-1551754655-cd27e38d2076",
    "mais": "photo-1551754655-cd27e38d2076",
    "sweet corn": "photo-1551754655-cd27e38d2076",
    "pea": "photo-1517666005606-69a7c4561a6e",
    "peas": "photo-1517666005606-69a7c4561a6e",
    "ert": "photo-1517666005606-69a7c4561a6e",
    "erter": "photo-1517666005606-69a7c4561a6e",
    "green beans": "photo-1474440692490-2e83ae13ba29",
    "beans": "photo-1474440692490-2e83ae13ba29",
    "bønner": "photo-1474440692490-2e83ae13ba29",
    "cauliflower": "photo-1568584711271-81773473f986",
    "blomkål": "photo-1568584711271-81773473f986",
    "cabbage": "photo-1594759554239-2f81e00c2a20",
    "kål": "photo-1594759554239-2f81e00c2a20",

    // Meat / Kjøtt
    "chicken": "photo-1604503468506-a8da13d82791",
    "chicken breast": "photo-1604503468506-a8da13d82791",
    "kylling": "photo-1604503468506-a8da13d82791",
    "kyllingbryst": "photo-1604503468506-a8da13d82791",
    "beef": "photo-1602470520998-f4a52199a3d6",
    "biff": "photo-1602470520998-f4a52199a3d6",
    "steak": "photo-1602470520998-f4a52199a3d6",
    "stek": "photo-1602470520998-f4a52199a3d6",
    "storfe": "photo-1602470520998-f4a52199a3d6",
    "lamb": "photo-1558030006-450675393462",
    "lam": "photo-1558030006-450675393462",
    "lammekjøtt": "photo-1558030006-450675393462",
    "pork": "photo-1588347818036-5e643c2b2e0f",
    "svinekjøtt": "photo-1588347818036-5e643c2b2e0f",
    "bacon": "photo-1528607929212-2636ec44253e",
    "salmon": "photo-1485921325833-c519f76c4927",
    "laks": "photo-1485921325833-c519f76c4927",
    "fish": "photo-1485921325833-c519f76c4927",
    "fisk": "photo-1485921325833-c519f76c4927",
    "ground beef": "photo-1603048297172-c92544798d5a",
    "kjøttdeig": "photo-1603048297172-c92544798d5a",

    // Fruits / Frukt
    "apple": "photo-1568702846914-96b305d2aaeb",
    "apples": "photo-1568702846914-96b305d2aaeb",
    "eple": "photo-1568702846914-96b305d2aaeb",
    "epler": "photo-1568702846914-96b305d2aaeb",
    "banana": "photo-1571771894821-ce9b6c11b08e",
    "bananas": "photo-1571771894821-ce9b6c11b08e",
    "banan": "photo-1571771894821-ce9b6c11b08e",
    "bananer": "photo-1571771894821-ce9b6c11b08e",
    "orange": "photo-1582979512210-99b6a53386f9",
    "oranges": "photo-1582979512210-99b6a53386f9",
    "appelsin": "photo-1582979512210-99b6a53386f9",
    "appelsiner": "photo-1582979512210-99b6a53386f9",
    "strawberry": "photo-1464965911861-746a04b4bca6",
    "strawberries": "photo-1464965911861-746a04b4bca6",
    "jordbær": "photo-1464965911861-746a04b4bca6",
    "blueberry": "photo-1498557850523-fd3d118b962e",
    "blueberries": "photo-1498557850523-fd3d118b962e",
    "blåbær": "photo-1498557850523-fd3d118b962e",
    "grape": "photo-1599819177-ff7d52d81c88",
    "grapes": "photo-1599819177-ff7d52d81c88",
    "druer": "photo-1599819177-ff7d52d81c88",
    "lemon": "photo-1590502593747-42a996133562",
    "lemons": "photo-1590502593747-42a996133562",
    "sitron": "photo-1590502593747-42a996133562",
    "avocado": "photo-1523049673857-eb18f1d7b578",
    "avokado": "photo-1523049673857-eb18f1d7b578",

    // Pantry / Spikermat
    "bread": "photo-1509440159596-0249088772ff",
    "brød": "photo-1509440159596-0249088772ff",
    "rice": "photo-1586201375761-83865001e31c",
    "ris": "photo-1586201375761-83865001e31c",
    "pasta": "photo-1551462147-ff29053bfc14",
    "eggs": "photo-1582722872445-44dc5f7e3c8f",
    "egg": "photo-1582722872445-44dc5f7e3c8f",
    "egge": "photo-1582722872445-44dc5f7e3c8f",
    "flour": "photo-1556910110-a5a63dfd393c",
    "mel": "photo-1556910110-a5a63dfd393c",
    "sugar": "photo-1587241321921-91aaab3e5b3e",
    "sukker": "photo-1587241321921-91aaab3e5b3e",
    "oil": "photo-1474979266404-7eaacbcd87c5",
    "olive oil": "photo-1474979266404-7eaacbcd87c5",
    "olje": "photo-1474979266404-7eaacbcd87c5",
    "salt": "photo-1532336414038-cf19250c5757",
    "coffee": "photo-1447933601403-0c6688de566e",
    "kaffe": "photo-1447933601403-0c6688de566e",
    "nescafe": "photo-1447933601403-0c6688de566e",
    "tea": "photo-1564890369478-c89ca6d9cde9",
    "te": "photo-1564890369478-c89ca6d9cde9",
  }

  const getUnsplashImage = (name: string) => {
    const normalizedName = name.toLowerCase().trim()
    const photoId = foodImageMap[normalizedName]

    if (photoId) {
      // High quality with optimized settings for food photography
      return `https://images.unsplash.com/${photoId}?w=600&h=400&fit=crop&q=90&auto=format`
    }

    // No fallback - just return null and use gradient background
    return null
  }

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${
        isExpiringSoon ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Food Image */}
      <div className={`relative h-48 bg-gradient-to-br ${getCategoryGradient(item.category)}`}>
        {getUnsplashImage(item.name) ? (
          <img
            src={getUnsplashImage(item.name)!}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to gradient background if image fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-20">🍽️</span>
          </div>
        )}
        {isExpiringSoon && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{item.category}</p>
        </div>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Quantity</span>
            <span className="text-sm font-medium text-gray-900">
              {item.quantity} {item.unit}
            </span>
          </div>

          <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${
            isExpiringSoon ? "bg-red-100" : "bg-gray-50"
          }`}>
            <span className="text-sm text-gray-600">Expires</span>
            <span
              className={`text-sm font-medium ${
                isExpiringSoon ? "text-red-700" : "text-gray-900"
              }`}
            >
              {expiryDate}
            </span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
