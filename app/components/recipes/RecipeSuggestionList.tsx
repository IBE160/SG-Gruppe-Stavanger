'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface RecipeSuggestion {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usesExpiringIngredients: boolean;
  readyInMinutes?: number;
  servings?: number;
}

export interface RecipeSuggestionListProps {
  suggestions: RecipeSuggestion[];
  onRecipeClick?: (recipeId: number) => void;
}

export function RecipeSuggestionList({
  suggestions,
  onRecipeClick,
}: RecipeSuggestionListProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {suggestions.map((suggestion) => (
        <Card
          key={suggestion.id}
          className={cn(
            'transition-all duration-300 border-2 overflow-hidden',
            'border-sage-green/30 bg-white',
            onRecipeClick && 'cursor-pointer hover:shadow-farmhouse hover:scale-105',
            'group relative'
          )}
          onClick={() => onRecipeClick?.(suggestion.id)}
          role={onRecipeClick ? 'button' : undefined}
          tabIndex={onRecipeClick ? 0 : undefined}
          onKeyDown={(e) => {
            if (onRecipeClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onRecipeClick(suggestion.id);
            }
          }}
          aria-label={`${suggestion.title}, uses ${suggestion.usedIngredientCount} of your ingredients, needs ${suggestion.missedIngredientCount} more`}
        >
          {/* Expiring Ingredient Badge */}
          {suggestion.usesExpiringIngredients && (
            <div className="absolute top-3 right-3 z-10 bg-terracotta text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Uses expiring items</span>
            </div>
          )}

          {/* Recipe Image */}
          <div className="relative w-full h-48 overflow-hidden bg-light-beige">
            {suggestion.image ? (
              <Image
                src={suggestion.image}
                alt={suggestion.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sage-green">
                <span className="text-4xl">🍽️</span>
              </div>
            )}
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-charcoal line-clamp-2 min-h-[3.5rem]">
              {suggestion.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Ingredient Match Indicators */}
            <div className="space-y-2">
              {/* Used Ingredients */}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-sage-green flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-charcoal">
                      Uses {suggestion.usedIngredientCount} of your ingredients
                    </span>
                  </div>
                  <div className="w-full bg-sage-green/20 rounded-full h-2 mt-1">
                    <div
                      className="bg-sage-green h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (suggestion.usedIngredientCount /
                            (suggestion.usedIngredientCount + suggestion.missedIngredientCount)) *
                            100
                        )}%`,
                      }}
                      role="progressbar"
                      aria-valuenow={suggestion.usedIngredientCount}
                      aria-valuemin={0}
                      aria-valuemax={
                        suggestion.usedIngredientCount + suggestion.missedIngredientCount
                      }
                      aria-label={`Uses ${suggestion.usedIngredientCount} ingredients from your pantry`}
                    />
                  </div>
                </div>
              </div>

              {/* Missing Ingredients */}
              {suggestion.missedIngredientCount > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-charcoal/50 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm text-charcoal/70">
                    Needs {suggestion.missedIngredientCount} more{' '}
                    {suggestion.missedIngredientCount === 1 ? 'ingredient' : 'ingredients'}
                  </span>
                </div>
              )}
            </div>

            {/* Recipe Details */}
            {(suggestion.readyInMinutes || suggestion.servings) && (
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-sage-green/10">
                {suggestion.readyInMinutes && (
                  <div className="flex items-center gap-2 text-sage-green">
                    <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-charcoal/70">Ready in</span>
                      <span className="text-sm font-semibold text-charcoal">
                        {suggestion.readyInMinutes} min
                      </span>
                    </div>
                  </div>
                )}

                {suggestion.servings && (
                  <div className="flex items-center gap-2 text-sage-green">
                    <Users className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-charcoal/70">Servings</span>
                      <span className="text-sm font-semibold text-charcoal">
                        {suggestion.servings}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
