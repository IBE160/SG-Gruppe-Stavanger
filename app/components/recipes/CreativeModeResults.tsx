'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface CreativeModeRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
  }>;
  missedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
  }>;
  likes: number;
}

export interface CreativeModeResultsProps {
  results: CreativeModeRecipe[];
  className?: string;
}

export function CreativeModeResults({ results, className }: CreativeModeResultsProps) {
  const router = useRouter();

  if (results.length === 0) {
    return (
      <Card className={cn('bg-white shadow-farmhouse border-sage-green/20', className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <ChefHat className="h-12 w-12 text-sage-green/50" aria-hidden="true" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-charcoal">No Results Yet</h3>
            <p className="text-sm text-charcoal/70 mt-1">
              Enter your ingredients above to discover creative recipe ideas
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('bg-white shadow-farmhouse border-sage-green/20', className)}>
      <CardHeader className="border-b border-sage-green/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-charcoal">
            Recipe Suggestions
          </CardTitle>
          <Badge variant="secondary" className="bg-sage-green/10 text-sage-green border-sage-green/20">
            {results.length} {results.length === 1 ? 'recipe' : 'recipes'} found
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((recipe) => (
            <CreativeModeRecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => router.push(`/recipes/${recipe.id}`)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CreativeModeRecipeCardProps {
  recipe: CreativeModeRecipe;
  onClick: () => void;
}

function CreativeModeRecipeCard({ recipe, onClick }: CreativeModeRecipeCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-300 border-2 overflow-hidden cursor-pointer',
        'border-sage-green/30 bg-white hover:shadow-farmhouse hover:scale-105',
        'group'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${recipe.title}, uses ${recipe.usedIngredientCount} of your ingredients, needs ${recipe.missedIngredientCount} more`}
    >
      {/* Recipe Image */}
      <div className="relative w-full h-48 overflow-hidden bg-light-beige">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
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
          {recipe.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Ingredient Match Stats */}
        <div className="space-y-2">
          {/* Used Ingredients */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-sage-green/10 flex-shrink-0">
              <Check className="h-3.5 w-3.5 text-sage-green" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-charcoal">
                {recipe.usedIngredientCount} of your {recipe.usedIngredientCount === 1 ? 'ingredient' : 'ingredients'}
              </p>
            </div>
          </div>

          {/* Missed Ingredients */}
          {recipe.missedIngredientCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-terracotta/10 flex-shrink-0">
                <Plus className="h-3.5 w-3.5 text-terracotta" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-charcoal/70">
                  {recipe.missedIngredientCount} more {recipe.missedIngredientCount === 1 ? 'ingredient' : 'ingredients'} needed
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Used Ingredients List */}
        {recipe.usedIngredients.length > 0 && (
          <div className="pt-2 border-t border-sage-green/10">
            <p className="text-xs font-medium text-charcoal/60 mb-2">Using:</p>
            <div className="flex flex-wrap gap-1.5">
              {recipe.usedIngredients.slice(0, 3).map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant="secondary"
                  className="text-xs bg-sage-green/10 text-sage-green border-sage-green/20"
                >
                  {ingredient.name}
                </Badge>
              ))}
              {recipe.usedIngredients.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-sage-green/10 text-sage-green border-sage-green/20"
                >
                  +{recipe.usedIngredients.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
