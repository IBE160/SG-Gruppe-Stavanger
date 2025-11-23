"use client"

import Link from "next/link"
import { Salad, LogOut, Bell, BarChart3, Recycle } from "lucide-react"
import { signOut } from "next-auth/react"
import { usePantryItems } from "@/hooks/usePantry"

export default function AlertsPage() {
  const { data: items = [], isLoading } = usePantryItems()

  // Calculate days until expiration and categorize
  const now = new Date()
  const itemsWithDays = items.map((item) => ({
    ...item,
    daysUntilExpiry: Math.ceil(
      (new Date(item.bestBeforeDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ),
  }))

  const expired = itemsWithDays.filter((item) => item.daysUntilExpiry < 0)
  const critical = itemsWithDays.filter(
    (item) => item.daysUntilExpiry >= 0 && item.daysUntilExpiry <= 1
  )
  const warning = itemsWithDays.filter(
    (item) => item.daysUntilExpiry > 1 && item.daysUntilExpiry <= 3
  )
  const safe = itemsWithDays.filter((item) => item.daysUntilExpiry > 3)

  const getItemImage = (name: string, category: string) => {
    // Map common food items to Unsplash images (matching PantryItemCard)
    const imageMap: { [key: string]: string } = {
      // Dairy
      milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop&q=80",
      melk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop&q=80",
      cheese: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=80&h=80&fit=crop&q=80",
      ost: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=80&h=80&fit=crop&q=80",
      yogurt: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop&q=80",
      yoghurt: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop&q=80",
      butter: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=80&h=80&fit=crop&q=80",
      smør: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=80&h=80&fit=crop&q=80",
      // Vegetables
      tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&h=80&fit=crop&q=80",
      tomatoes: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&h=80&fit=crop&q=80",
      tomat: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&h=80&fit=crop&q=80",
      lettuce: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=80&h=80&fit=crop&q=80",
      salat: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=80&h=80&fit=crop&q=80",
      carrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&h=80&fit=crop&q=80",
      carrots: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&h=80&fit=crop&q=80",
      gulrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=80&h=80&fit=crop&q=80",
      onion: "https://images.unsplash.com/photo-1508747703725-719777637510?w=80&h=80&fit=crop&q=80",
      løk: "https://images.unsplash.com/photo-1508747703725-719777637510?w=80&h=80&fit=crop&q=80",
      potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&h=80&fit=crop&q=80",
      potatoes: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&h=80&fit=crop&q=80",
      potet: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&h=80&fit=crop&q=80",
      broccoli: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=80&h=80&fit=crop&q=80",
      brokkoli: "https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=80&h=80&fit=crop&q=80",
      cucumber: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=80&h=80&fit=crop&q=80",
      agurk: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=80&h=80&fit=crop&q=80",
      paprika: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=80&h=80&fit=crop&q=80",
      pepper: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=80&h=80&fit=crop&q=80",
      spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&h=80&fit=crop&q=80",
      spinat: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&h=80&fit=crop&q=80",
      mushroom: "https://images.unsplash.com/photo-1515664069124-6a81e6be4adb?w=80&h=80&fit=crop&q=80",
      mushrooms: "https://images.unsplash.com/photo-1515664069124-6a81e6be4adb?w=80&h=80&fit=crop&q=80",
      sopp: "https://images.unsplash.com/photo-1515664069124-6a81e6be4adb?w=80&h=80&fit=crop&q=80",
      garlic: "https://images.unsplash.com/photo-1591679252260-1d5b30d5bab2?w=80&h=80&fit=crop&q=80",
      hvitløk: "https://images.unsplash.com/photo-1591679252260-1d5b30d5bab2?w=80&h=80&fit=crop&q=80",
      // Meat
      chicken: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=80&h=80&fit=crop&q=80",
      kylling: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=80&h=80&fit=crop&q=80",
      beef: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=80&h=80&fit=crop&q=80",
      biff: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=80&h=80&fit=crop&q=80",
      pork: "https://images.unsplash.com/photo-1588347818036-5e643c2b2e0f?w=80&h=80&fit=crop&q=80",
      svinekjøtt: "https://images.unsplash.com/photo-1588347818036-5e643c2b2e0f?w=80&h=80&fit=crop&q=80",
      bacon: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=80&h=80&fit=crop&q=80",
      salmon: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=80&h=80&fit=crop&q=80",
      laks: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=80&h=80&fit=crop&q=80",
      fish: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=80&h=80&fit=crop&q=80",
      fisk: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=80&h=80&fit=crop&q=80",
      // Fruits
      apple: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&h=80&fit=crop&q=80",
      apples: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&h=80&fit=crop&q=80",
      eple: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=80&h=80&fit=crop&q=80",
      banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop&q=80",
      bananas: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop&q=80",
      banan: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=80&h=80&fit=crop&q=80",
      orange: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=80&h=80&fit=crop&q=80",
      oranges: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=80&h=80&fit=crop&q=80",
      appelsin: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=80&h=80&fit=crop&q=80",
      strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=80&h=80&fit=crop&q=80",
      jordbær: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=80&h=80&fit=crop&q=80",
      lemon: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=80&h=80&fit=crop&q=80",
      sitron: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=80&h=80&fit=crop&q=80",
      avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&h=80&fit=crop&q=80",
      avokado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=80&h=80&fit=crop&q=80",
      // Pantry
      bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop&q=80",
      brød: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop&q=80",
      rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80&h=80&fit=crop&q=80",
      ris: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80&h=80&fit=crop&q=80",
      pasta: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=80&h=80&fit=crop&q=80",
      eggs: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=80&h=80&fit=crop&q=80",
      egg: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=80&h=80&fit=crop&q=80",
      flour: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=80&h=80&fit=crop&q=80",
      mel: "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=80&h=80&fit=crop&q=80",
      sugar: "https://images.unsplash.com/photo-1587241321921-91aaab3e5b3e?w=80&h=80&fit=crop&q=80",
      sukker: "https://images.unsplash.com/photo-1587241321921-91aaab3e5b3e?w=80&h=80&fit=crop&q=80",
      oil: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80&h=80&fit=crop&q=80",
      olje: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80&h=80&fit=crop&q=80",
      coffee: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop&q=80",
      kaffe: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop&q=80",
    }

    const normalizedName = name.toLowerCase().trim()

    // Try exact match first
    if (imageMap[normalizedName]) {
      return imageMap[normalizedName]
    }

    // Try partial match - check if name contains key (min 3 chars to avoid false matches)
    for (const [key, value] of Object.entries(imageMap)) {
      if (key.length >= 3 && normalizedName.includes(key)) {
        return value
      }
    }

    // Try matching individual words
    const words = normalizedName.split(' ')
    for (const word of words) {
      if (word.length >= 3 && imageMap[word]) {
        return imageMap[word]
      }
    }

    // Fallback to category-based images
    const categoryMap: { [key: string]: string } = {
      dairy: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop&q=80",
      produce: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=80&h=80&fit=crop&q=80",
      meat: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=80&h=80&fit=crop&q=80",
      grains: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80&h=80&fit=crop&q=80",
      other: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=80&h=80&fit=crop&q=80",
    }
    return categoryMap[category] || categoryMap.other
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <p className="text-[#333333]">Loading alerts...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <Link href="/pantry" className="flex items-center gap-2">
              <Salad className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">ibe160</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/pantry"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Pantry
              </Link>
              <Link
                href="/recipes"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Recipes
              </Link>
              <Link
                href="/grocery"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Grocery
              </Link>
              <Link
                href="/alerts"
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg"
              >
                Alerts
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12">
        {/* Hero Section */}
        <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Never Miss an Expiration Date
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Get smart alerts about your food expiration dates. Save money, reduce waste, and always know what needs to be used first.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <Bell className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Smart Reminders</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Track Everything</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200">
                  <Recycle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Reduce Waste</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop&q=80"
                alt="Fresh produce in refrigerator"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent flex flex-col justify-end p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&h=80&fit=crop&q=80"
                          alt="Tomatoes"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900">Tomatoes</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-xs font-medium text-green-700">Fresh</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop&q=80"
                          alt="Milk"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900">Milk</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50">
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                      <span className="text-xs font-medium text-yellow-700">Expiring Soon</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=80&h=80&fit=crop&q=80"
                          alt="Chicken"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-gray-900">Chicken</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span className="text-xs font-medium text-red-700">Expired</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          <div className="flex flex-col gap-2 rounded-xl border border-[#e5e2dc] bg-white p-5 text-center">
            <p className="text-3xl font-bold text-[#E54D4D]">{expired.length}</p>
            <p className="text-sm text-[#877a64] font-medium">Expired</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#e5e2dc] bg-white p-5 text-center">
            <p className="text-3xl font-bold text-[#FF9800]">{critical.length}</p>
            <p className="text-sm text-[#877a64] font-medium">Critical (0-1 days)</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#e5e2dc] bg-white p-5 text-center">
            <p className="text-3xl font-bold text-[#FFC107]">{warning.length}</p>
            <p className="text-sm text-[#877a64] font-medium">Warning (2-3 days)</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#e5e2dc] bg-white p-5 text-center">
            <p className="text-3xl font-bold text-[#2D5A3D]">{safe.length}</p>
            <p className="text-sm text-[#877a64] font-medium">Safe (3+ days)</p>
          </div>
        </div>

        {/* Expired Items */}
        {expired.length > 0 && (
          <div className="mb-6 rounded-xl border border-[#e5e2dc] bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#E54D4D]">
              <span className="material-symbols-outlined">warning</span>
              Expired Items
            </h2>
            <div className="space-y-3">
              {expired.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getItemImage(item.name, item.category)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#333333]">{item.name}</p>
                      <p className="text-sm text-[#E54D4D] font-medium">
                        Expired {Math.abs(item.daysUntilExpiry)} days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-[#333333] font-medium">
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-xs text-[#877a64]">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-50">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span className="text-xs font-medium text-red-700">Expired</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Items (0-1 days) */}
        {critical.length > 0 && (
          <div className="mb-6 rounded-xl border border-[#e5e2dc] bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#FF9800]">
              <span className="material-symbols-outlined">emergency</span>
              Critical (Use Today!)
            </h2>
            <div className="space-y-3">
              {critical.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getItemImage(item.name, item.category)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#333333]">{item.name}</p>
                      <p className="text-sm text-[#FF9800] font-medium">
                        {item.daysUntilExpiry === 0
                          ? "Expires today"
                          : `Expires in ${item.daysUntilExpiry} day`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-[#333333] font-medium">
                        {item.quantity} {item.unit}
                      </p>
                      <Link
                        href={`/recipes?ingredient=${item.name}`}
                        className="text-xs text-[#2D5A3D] hover:underline font-medium"
                      >
                        Find Recipes →
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                      <span className="text-xs font-medium text-orange-700">Use Today</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Items (2-3 days) */}
        {warning.length > 0 && (
          <div className="mb-6 rounded-xl border border-[#e5e2dc] bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#FFC107]">
              <span className="material-symbols-outlined">schedule</span>
              Use Soon (2-3 days)
            </h2>
            <div className="space-y-3">
              {warning.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getItemImage(item.name, item.category)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#333333]">{item.name}</p>
                      <p className="text-sm text-[#FFC107] font-medium">
                        Expires in {item.daysUntilExpiry} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-[#333333] font-medium">
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-xs text-[#877a64]">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50">
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                      <span className="text-xs font-medium text-yellow-700">Expiring Soon</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe Items */}
        {safe.length > 0 && (
          <div className="mb-6 rounded-xl border border-[#e5e2dc] bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-[#2D5A3D]">
              <span className="material-symbols-outlined">check_circle</span>
              Safe Items (3+ days)
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {safe.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getItemImage(item.name, item.category)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#333333]">{item.name}</p>
                      <p className="text-xs text-[#2D5A3D] font-medium">
                        {item.daysUntilExpiry} days left
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-medium text-green-700">Fresh</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="mb-6 rounded-xl border border-[#e5e2dc] bg-white p-12 text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-[#2D5A3D]/30">
              notifications
            </span>
            <h2 className="mb-2 text-2xl font-bold text-[#333333]">No Items in Pantry</h2>
            <p className="mb-6 text-[#877a64]">
              Add items to your pantry to start tracking expiration dates!
            </p>
            <Link
              href="/pantry"
              className="inline-block rounded-xl bg-[#2D5A3D] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#2D5A3D]/90"
            >
              Go to Pantry
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
