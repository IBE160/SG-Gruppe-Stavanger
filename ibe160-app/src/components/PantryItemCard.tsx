// PantryItemCard component for displaying food items

import { Milk, Salad, Drumstick, Wheat, Package, AlertTriangle } from "lucide-react"

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

  // Category icon mapping
  const CategoryIcon = () => {
    const iconProps = { className: "w-8 h-8", strokeWidth: 2 }
    switch (item.category) {
      case "dairy":
        return <Milk {...iconProps} className="w-8 h-8 text-blue-600" />
      case "produce":
        return <Salad {...iconProps} className="w-8 h-8 text-green-600" />
      case "meat":
        return <Drumstick {...iconProps} className="w-8 h-8 text-red-600" />
      case "grains":
        return <Wheat {...iconProps} className="w-8 h-8 text-yellow-600" />
      default:
        return <Package {...iconProps} className="w-8 h-8 text-gray-600" />
    }
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-2 ${
        isExpiringSoon ? "border-red-300 bg-red-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0"><CategoryIcon /></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{item.category}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Quantity:</span>
          <span className="text-sm font-medium text-gray-900">
            {item.quantity} {item.unit}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Expires:</span>
          <span
            className={`text-sm font-medium ${
              isExpiringSoon ? "text-red-600" : "text-gray-900"
            }`}
          >
            {expiryDate}
          </span>
        </div>

        {isExpiringSoon && (
          <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            <span>Expiring in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}!</span>
          </div>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}
