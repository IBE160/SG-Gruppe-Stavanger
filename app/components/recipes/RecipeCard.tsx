'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onClick?: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const isClickable = !!onClick;

  return (
    <Card
      className={cn(
        'transition-all duration-300 border-2 overflow-hidden',
        'border-sage-green/30 bg-white',
        isClickable && 'cursor-pointer hover:shadow-farmhouse hover:scale-105',
        'group'
      )}
      onClick={() => onClick?.(recipe)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.(recipe);
        }
      }}
      aria-label={`${recipe.title}, ready in ${recipe.readyInMinutes} minutes, serves ${recipe.servings}`}
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
        <div className="flex items-center justify-between gap-4">
          {/* Ready Time */}
          <div className="flex items-center gap-2 text-sage-green">
            <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-charcoal/70">Ready in</span>
              <span className="text-sm font-semibold text-charcoal">
                {recipe.readyInMinutes} min
              </span>
            </div>
          </div>

          {/* Servings */}
          <div className="flex items-center gap-2 text-sage-green">
            <Users className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-charcoal/70">Servings</span>
              <span className="text-sm font-semibold text-charcoal">
                {recipe.servings}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
