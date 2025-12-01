'use client';

import { Check, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MatchedIngredient } from '@/lib/ingredient-matcher';

export interface IngredientMatchIndicatorProps {
  ingredients: MatchedIngredient[];
  onAddToShoppingList?: (ingredient: MatchedIngredient) => void;
  addingToList?: Set<number>;
}

export function IngredientMatchIndicator({
  ingredients,
  onAddToShoppingList,
  addingToList = new Set(),
}: IngredientMatchIndicatorProps) {
  return (
    <div className="space-y-3">
      {ingredients.map((ingredient) => {
        const isAvailable = ingredient.available;
        const isAdding = addingToList.has(ingredient.id);

        return (
          <div
            key={ingredient.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border-2 transition-all',
              isAvailable
                ? 'bg-sage-green/5 border-sage-green/30'
                : 'bg-terracotta/5 border-terracotta/30'
            )}
          >
            {/* Status Icon */}
            <div
              className={cn(
                'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5',
                isAvailable
                  ? 'bg-sage-green text-white'
                  : 'bg-terracotta text-white'
              )}
              aria-label={isAvailable ? 'Available in inventory' : 'Missing from inventory'}
            >
              {isAvailable ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <X className="h-4 w-4" aria-hidden="true" />
              )}
            </div>

            {/* Ingredient Details */}
            <div className="flex-grow min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium text-charcoal">
                  {ingredient.amount} {ingredient.unit}
                </span>
                <span className="text-charcoal/90">{ingredient.name}</span>
              </div>
              {ingredient.original && (
                <p className="text-sm text-charcoal/60 mt-1">
                  {ingredient.original}
                </p>
              )}
              {isAvailable && ingredient.matchConfidence && ingredient.matchConfidence < 1 && (
                <p className="text-xs text-sage-green mt-1">
                  Matched with {Math.round(ingredient.matchConfidence * 100)}% confidence
                </p>
              )}
            </div>

            {/* Add to Shopping List Button */}
            {!isAvailable && onAddToShoppingList && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddToShoppingList(ingredient)}
                disabled={isAdding}
                className={cn(
                  'flex-shrink-0 text-terracotta border-terracotta/30 hover:bg-terracotta/10',
                  isAdding && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={`Add ${ingredient.name} to shopping list`}
              >
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
