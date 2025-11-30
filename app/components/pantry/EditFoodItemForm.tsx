'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Edit3 } from 'lucide-react';
import { FoodItem } from './IngredientIcon';

// Client-side validation schema
const editFoodItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category is too long'),
  bestBeforeDate: z.string().min(1, 'Best before date is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit is too long'),
});

type FormData = {
  name: string;
  category: string;
  bestBeforeDate: string;
  quantity: string;
  unit: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export interface EditFoodItemFormProps {
  item: FoodItem;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedItem: FoodItem) => void;
}

export function EditFoodItemForm({ item, open, onClose, onSuccess }: EditFoodItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    bestBeforeDate: '',
    quantity: '',
    unit: '',
  });

  // Pre-populate form with item data when dialog opens
  useEffect(() => {
    if (open && item) {
      const date = new Date(item.bestBeforeDate);
      const formattedDate = date.toISOString().split('T')[0];

      setFormData({
        name: item.name,
        category: item.category,
        bestBeforeDate: formattedDate,
        quantity: String(item.quantity),
        unit: item.unit,
      });
      setError(null);
      setErrors({});
    }
  }, [open, item]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    // Client-side validation
    const validationResult = editFoodItemSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: FormErrors = {};
      validationResult.error.issues.forEach((err) => {
        const path = err.path[0] as keyof FormData;
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Convert quantity to number and format date
      const quantity = parseFloat(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        setErrors({ quantity: 'Quantity must be a positive number' });
        setLoading(false);
        return;
      }

      // Format date to ISO 8601
      const bestBeforeDate = new Date(formData.bestBeforeDate);
      if (isNaN(bestBeforeDate.getTime())) {
        setErrors({ bestBeforeDate: 'Invalid date format' });
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/inventory/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          bestBeforeDate: bestBeforeDate.toISOString(),
          quantity,
          unit: formData.unit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError('You do not have permission to edit this item');
        } else if (response.status === 404) {
          setError('Food item not found');
        } else if (data.details) {
          // Server-side validation errors
          const newErrors: FormErrors = {};
          data.details.forEach((err: { path: string[]; message: string }) => {
            const field = err.path[0] as keyof FormData;
            newErrors[field] = err.message;
          });
          setErrors(newErrors);
        } else {
          setError(data.error || 'Failed to update food item');
        }
        setLoading(false);
        return;
      }

      // Success - call onSuccess callback with updated item
      onSuccess(data.foodItem);
      onClose();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-charcoal flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-sage-green" />
            Edit Food Item
          </DialogTitle>
          <DialogDescription className="text-sage-green">
            Update the details of your food item.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-charcoal">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Organic Tomatoes"
                className={errors.name ? 'border-red-500' : ''}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'edit-name-error' : undefined}
              />
              {errors.name && (
                <p id="edit-name-error" className="text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-category" className="text-charcoal">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Vegetables, Dairy, Meat"
                className={errors.category ? 'border-red-500' : ''}
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? 'edit-category-error' : undefined}
              />
              {errors.category && (
                <p id="edit-category-error" className="text-sm text-red-500">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-bestBeforeDate" className="text-charcoal">
                Best Before Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-bestBeforeDate"
                type="date"
                value={formData.bestBeforeDate}
                onChange={(e) => handleInputChange('bestBeforeDate', e.target.value)}
                className={errors.bestBeforeDate ? 'border-red-500' : ''}
                aria-invalid={!!errors.bestBeforeDate}
                aria-describedby={errors.bestBeforeDate ? 'edit-bestBeforeDate-error' : undefined}
              />
              {errors.bestBeforeDate && (
                <p id="edit-bestBeforeDate-error" className="text-sm text-red-500">
                  {errors.bestBeforeDate}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity" className="text-charcoal">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="e.g., 2.5"
                  className={errors.quantity ? 'border-red-500' : ''}
                  aria-invalid={!!errors.quantity}
                  aria-describedby={errors.quantity ? 'edit-quantity-error' : undefined}
                />
                {errors.quantity && (
                  <p id="edit-quantity-error" className="text-sm text-red-500">
                    {errors.quantity}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-unit" className="text-charcoal">
                  Unit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  placeholder="e.g., kg, pcs, liters"
                  className={errors.unit ? 'border-red-500' : ''}
                  aria-invalid={!!errors.unit}
                  aria-describedby={errors.unit ? 'edit-unit-error' : undefined}
                />
                {errors.unit && (
                  <p id="edit-unit-error" className="text-sm text-red-500">
                    {errors.unit}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="text-charcoal"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-terracotta text-white hover:bg-terracotta/90"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
