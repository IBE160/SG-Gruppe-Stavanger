'use client';

import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface UpdatedItem {
  id: string;
  name: string;
  previousQuantity: number;
  newQuantity: number;
  unit: string;
}

export interface Warning {
  item: string;
  message: string;
}

export interface UpdateSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updatedItems: UpdatedItem[];
  warnings: Warning[];
  onViewPantry?: () => void;
}

export function UpdateSummary({
  open,
  onOpenChange,
  updatedItems,
  warnings,
  onViewPantry,
}: UpdateSummaryProps) {
  const hasWarnings = warnings.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-sage-green/20 sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              hasWarnings ? 'bg-yellow-500/10' : 'bg-sage-green/10'
            }`}>
              {hasWarnings ? (
                <AlertTriangle className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-sage-green" aria-hidden="true" />
              )}
            </div>
            <DialogTitle className="text-2xl text-charcoal">
              {hasWarnings ? 'Inventory Updated with Warnings' : 'Great Job!'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-charcoal/70 text-base pt-2">
            {hasWarnings
              ? 'Your pantry has been updated, but there were some issues.'
              : 'Your pantry has been updated successfully.'}
          </DialogDescription>
        </DialogHeader>

        {/* Updated Items */}
        {updatedItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wide">
              Updated Items
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {updatedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-light-beige/30 rounded-lg border border-sage-green/10"
                >
                  <div className="flex-1">
                    <p className="font-medium text-charcoal">{item.name}</p>
                    <p className="text-sm text-charcoal/60">
                      {item.previousQuantity} {item.unit} → {item.newQuantity} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-sage-green">
                      -{(item.previousQuantity - item.newQuantity).toFixed(2)} {item.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-3 mt-4">
            <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wide flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" aria-hidden="true" />
              Warnings
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <p className="font-medium text-charcoal text-sm">{warning.item}</p>
                  <p className="text-sm text-charcoal/70 mt-1">{warning.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {onViewPantry && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onViewPantry();
                onOpenChange(false);
              }}
              className="border-sage-green/30 text-charcoal hover:bg-sage-green/5"
            >
              View Pantry
            </Button>
          )}
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-sage-green hover:bg-sage-green/90 text-white"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
