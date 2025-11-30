'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortField = 'name' | 'category' | 'bestBeforeDate' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface SortControlsProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
}

export function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  const handleSortByChange = (value: string) => {
    onSortChange(value as SortField, sortOrder);
  };

  const handleSortOrderChange = (value: string) => {
    onSortChange(sortBy, value as SortOrder);
  };

  const getSortLabel = (field: SortField): string => {
    const labels: Record<SortField, string> = {
      name: 'Name',
      category: 'Category',
      bestBeforeDate: 'Best Before Date',
      createdAt: 'Date Added',
    };
    return labels[field];
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-sage-green" />
        <span className="text-sm font-medium text-charcoal">Sort by:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:flex-initial">
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <Label htmlFor="sort-by" className="sr-only">
            Sort field
          </Label>
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger
              id="sort-by"
              className="bg-white border-sage-green/30 focus:ring-sage-green"
              aria-label="Select sort field"
            >
              <SelectValue placeholder="Select field">
                {getSortLabel(sortBy)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="bestBeforeDate">Best Before Date</SelectItem>
              <SelectItem value="createdAt">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <Label htmlFor="sort-order" className="sr-only">
            Sort order
          </Label>
          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger
              id="sort-order"
              className="bg-white border-sage-green/30 focus:ring-sage-green"
              aria-label="Select sort order"
            >
              <SelectValue placeholder="Select order">
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
