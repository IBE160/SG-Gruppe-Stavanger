'use client';

import { ChefHat } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface CookingConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeTitle: string;
  recipeServings: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CookingConfirmationDialog({
  open,
  onOpenChange,
  recipeTitle,
  recipeServings,
  onConfirm,
  isLoading = false,
}: CookingConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-sage-green/20 sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sage-green/10">
              <ChefHat className="h-6 w-6 text-sage-green" aria-hidden="true" />
            </div>
            <DialogTitle className="text-2xl text-charcoal">
              Confirm Cooking
            </DialogTitle>
          </div>
          <DialogDescription className="text-charcoal/70 text-base pt-2">
            Did you cook{' '}
            <span className="font-semibold text-charcoal">{recipeTitle}</span>?
          </DialogDescription>
          <div className="text-sm text-charcoal/60 pt-2">
            This will deduct ingredients for {recipeServings} serving{recipeServings !== 1 ? 's' : ''} from your pantry.
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="border-sage-green/30 text-charcoal hover:bg-sage-green/5"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-sage-green hover:bg-sage-green/90 text-white"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              'Yes, I Cooked This'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
