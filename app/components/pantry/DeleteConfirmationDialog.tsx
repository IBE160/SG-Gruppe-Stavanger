'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { FoodItem } from './IngredientIcon';

export interface DeleteConfirmationDialogProps {
  item: FoodItem;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (itemId: string) => Promise<void>;
}

export function DeleteConfirmationDialog({
  item,
  isOpen,
  onClose,
  onConfirm
}: DeleteConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);

    try {
      await onConfirm(item.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-charcoal flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Delete Food Item
          </DialogTitle>
          <DialogDescription className="text-sage-green">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 mb-4">
              {error}
            </div>
          )}

          <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
            <p className="text-sm text-charcoal mb-3">
              Are you sure you want to delete this food item?
            </p>
            <div className="bg-white rounded-md p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal/70">Name:</span>
                <span className="text-sm font-semibold text-charcoal">{item.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal/70">Category:</span>
                <span className="text-sm text-sage-green">{item.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal/70">Quantity:</span>
                <span className="text-sm text-charcoal">
                  {item.quantity} {item.unit}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="text-charcoal border-charcoal/20"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
