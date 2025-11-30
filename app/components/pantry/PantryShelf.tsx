'use client';

import { IngredientIcon, FoodItem } from './IngredientIcon';
import { useState } from 'react';

export interface PantryShelfProps {
  foodItems: FoodItem[];
  onItemSelect?: (item: FoodItem) => void;
}

export function PantryShelf({ foodItems, onItemSelect }: PantryShelfProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleItemClick = (item: FoodItem) => {
    setSelectedItemId(item.id);
    onItemSelect?.(item);
  };

  if (foodItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-light-beige border-2 border-dashed border-sage-green/30 p-12 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-sage-green/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              Your Pantry is Empty
            </h3>
            <p className="text-sm text-charcoal/70">
              Click &quot;Add Item&quot; to start tracking your food inventory and reduce waste.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="grid gap-4 auto-rows-fr"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
        role="region"
        aria-label="Pantry shelf with food items"
      >
        {foodItems.map((item) => (
          <IngredientIcon
            key={item.id}
            item={item}
            state={selectedItemId === item.id ? 'selected' : 'normal'}
            onClick={onItemSelect ? () => handleItemClick(item) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
