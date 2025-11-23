// PantryItemCard component for displaying food items with images

import { useState } from "react"
import { AlertTriangle, Clock } from "lucide-react"

interface FoodItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  bestBeforeDate: string
  image?: string | null
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
    "cucumber": "photo-1449300079323-02e209d9d3a6",
    "cucumbers": "photo-1449300079323-02e209d9d3a6",
    "agurk": "photo-1449300079323-02e209d9d3a6",
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
    "coffee": "photo-1559056199-641a0ac8b55e",
    "kaffe": "photo-1559056199-641a0ac8b55e",
    "kaff": "photo-1559056199-641a0ac8b55e",
    "nescafe": "photo-1509042239860-f550ce710b93",
    "nescafé": "photo-1509042239860-f550ce710b93",
    "instant coffee": "photo-1509042239860-f550ce710b93",
    "tea": "photo-1564890369478-c89ca6d9cde9",
    "te": "photo-1564890369478-c89ca6d9cde9",
  }

  const getUnsplashImage = (name: string) => {
    const normalizedName = name.toLowerCase().trim()

    // Try exact match first
    let photoId = foodImageMap[normalizedName]

    // Try partial match - check if any key is contained in name or name contains key
    if (!photoId) {
      for (const [key, value] of Object.entries(foodImageMap)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
          photoId = value
          break
        }
      }
    }

    // Try matching individual words
    if (!photoId) {
      const words = normalizedName.split(' ')
      for (const word of words) {
        if (word.length >= 3 && foodImageMap[word]) {
          photoId = foodImageMap[word]
          break
        }
      }
    }

    if (photoId) {
      // Optimized smaller size for card display
      return `https://images.unsplash.com/${photoId}?w=300&h=300&fit=crop&q=80&auto=format`
    }

    // No fallback - just return null and use gradient background
    return null
  }

  // Get Spoonacular ingredient image as fallback
  const getSpoonacularImage = (name: string) => {
    // Spoonacular uses ingredient names in format: "ingredient-name.jpg"
    // Clean the name: remove brand names, convert to lowercase, replace spaces with hyphens
    const cleanName = name
      .toLowerCase()
      .replace(/\d+g|\d+ml|\d+kg|\d+l/g, '') // Remove quantities
      .replace(/nestle|coca-cola|pepsi|kraft|unilever/gi, '') // Remove common brands
      .trim()
      .split(' ')[0] // Take first word (e.g., "lamb" from "lamb shank")
      .replace(/s$/, '') // Remove plural (eggs -> egg)

    if (cleanName.length < 2) return null

    // Spoonacular ingredient images - using smaller 250x250 version
    return `https://img.spoonacular.com/ingredients_250x250/${cleanName}.jpg`
  }

  // Get the best image: prioritize database image, then Unsplash, then Spoonacular, then null
  const getImage = () => {
    console.log(`[PantryItemCard] ${item.name} - Database image:`, item.image)
    if (item.image) {
      console.log(`[PantryItemCard] ${item.name} - Using database image`)
      return item.image
    }
    const unsplashImage = getUnsplashImage(item.name)
    if (unsplashImage) {
      console.log(`[PantryItemCard] ${item.name} - Using Unsplash image`)
      return unsplashImage
    }
    const spoonacularImage = getSpoonacularImage(item.name)
    console.log(`[PantryItemCard] ${item.name} - Using Spoonacular image:`, spoonacularImage)
    return spoonacularImage
  }

  // Get status badge
  const getStatusBadge = () => {
    if (daysUntilExpiry < 0) {
      return {
        label: "Expired",
        bgColor: "bg-[#E54D4D]/10",
        textColor: "text-[#E54D4D]",
      }
    } else if (daysUntilExpiry <= 1) {
      return {
        label: "Use Soon",
        bgColor: "bg-[#E54D4D]/10",
        textColor: "text-[#E54D4D]",
      }
    } else if (daysUntilExpiry <= 3) {
      return {
        label: "Nearing Expiry",
        bgColor: "bg-[#FFB838]/10",
        textColor: "text-[#FFB838]",
      }
    } else {
      return {
        label: "Fresh",
        bgColor: "bg-[#2BAF74]/10",
        textColor: "text-[#2BAF74]",
      }
    }
  }

  const status = getStatusBadge()
  const imageUrl = getImage()
  const [imageError, setImageError] = useState(false)

  // Get emoji based on category or item name
  const getEmoji = () => {
    const name = item.name.toLowerCase()
    const category = item.category.toLowerCase()

    // Specific items
    if (name.includes('egg') || name.includes('egge')) return '🥚'
    if (name.includes('milk') || name.includes('melk')) return '🥛'
    if (name.includes('chicken') || name.includes('kylling')) return '🍗'
    if (name.includes('tomato') || name.includes('tomat')) return '🍅'
    if (name.includes('cheese') || name.includes('ost')) return '🧀'
    if (name.includes('bread') || name.includes('brød')) return '🍞'
    if (name.includes('apple') || name.includes('eple')) return '🍎'
    if (name.includes('banana') || name.includes('banan')) return '🍌'
    if (name.includes('carrot') || name.includes('gulrot')) return '🥕'
    if (name.includes('potato') || name.includes('potet')) return '🥔'
    if (name.includes('fish') || name.includes('fisk') || name.includes('salmon') || name.includes('laks')) return '🐟'
    if (name.includes('beef') || name.includes('meat') || name.includes('kjøtt')) return '🥩'

    // Category fallbacks
    if (category === 'dairy') return '🥛'
    if (category === 'produce') return '🥗'
    if (category === 'meat') return '🍗'
    if (category === 'grains') return '🌾'

    return '🍽️'
  }

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-[#EAEAEA] bg-white p-4 shadow-sm transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="aspect-square w-full rounded-lg bg-[#F7F7F7] flex items-center justify-center overflow-hidden relative">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-5xl">{getEmoji()}</span>
        )}

        {/* Edit and Delete Buttons - Shown on Hover - TOP RIGHT */}
        {(onEdit || onDelete) && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="flex size-7 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="flex size-7 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white shadow-md"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        )}

        {/* Countdown Overlay - BOTTOM LEFT - Always shown */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-md">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-semibold text-gray-900">
              {daysUntilExpiry < 0
                ? `${Math.abs(daysUntilExpiry)}d ago`
                : daysUntilExpiry === 0
                  ? "Today"
                  : `${daysUntilExpiry}d`}
            </span>
          </div>
        </div>
      </div>

      {/* Name and Quantity */}
      <div className="flex flex-col">
        <p className="font-bold text-[#333333]">{item.name}</p>
        <p className="text-sm text-[#333333]/70">
          {item.quantity} {item.unit}
        </p>
      </div>

      {/* Status Badge */}
      <div
        className={`inline-flex w-fit items-center justify-center rounded-full ${status.bgColor} px-3 py-1 text-xs font-medium ${status.textColor}`}
      >
        {status.label}
      </div>
    </div>
  )
}
