'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Calendar, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  bestBeforeDate: string | Date;
  quantity: number;
  unit: string;
  createdAt: string | Date;
}

export interface IngredientIconProps {
  item: FoodItem;
  state?: 'normal' | 'expiring' | 'selected';
  onClick?: () => void;
}

export function IngredientIcon({ item, state = 'normal', onClick }: IngredientIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate freshness status
  const getFreshnessStatus = () => {
    const bestBefore = new Date(item.bestBeforeDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((bestBefore.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired', label: 'Expired', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-300' };
    } else if (daysUntilExpiry <= 3) {
      return { status: 'expiring', label: `${daysUntilExpiry}d left`, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-300' };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'soon', label: `${daysUntilExpiry}d left`, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' };
    } else {
      return { status: 'fresh', label: 'Fresh', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-300' };
    }
  };

  const freshness = getFreshnessStatus();
  const isClickable = !!onClick;

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className={cn(
        'transition-all duration-200 border-2 relative',
        freshness.borderColor,
        state === 'selected' && 'ring-2 ring-sage-green shadow-lg',
        state === 'expiring' && freshness.status === 'expiring' && 'animate-pulse',
        isClickable && 'cursor-pointer hover:shadow-md hover:scale-105',
        'bg-white'
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${item.name}, ${item.quantity} ${item.unit}, ${freshness.label}${isClickable ? ', Click to edit' : ''}`}
    >
      {/* Edit Button Overlay */}
      {isClickable && isHovered && (
        <div className="absolute top-2 right-2 z-10 bg-sage-green text-white rounded-full p-2 shadow-md transition-all duration-200">
          <Edit3 className="h-4 w-4" aria-hidden="true" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-charcoal line-clamp-2">
            {item.name}
          </CardTitle>
          {(freshness.status === 'expired' || freshness.status === 'expiring') && (
            <AlertTriangle className={cn('h-5 w-5 flex-shrink-0', freshness.color)} aria-label="Expiring soon" />
          )}
        </div>
        <p className="text-sm text-sage-green">{item.category}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-charcoal">Quantity:</span>
          <span className="text-base font-bold text-charcoal">
            {item.quantity} {item.unit}
          </span>
        </div>

        <div className={cn('rounded-md p-2 flex items-center gap-2', freshness.bgColor)}>
          <Calendar className={cn('h-4 w-4', freshness.color)} />
          <div className="flex-1">
            <p className="text-xs font-medium text-charcoal/70">Best Before</p>
            <p className={cn('text-sm font-semibold', freshness.color)}>
              {formatDate(item.bestBeforeDate)}
            </p>
          </div>
          <span className={cn('text-xs font-bold px-2 py-1 rounded', freshness.bgColor, freshness.color)}>
            {freshness.label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
