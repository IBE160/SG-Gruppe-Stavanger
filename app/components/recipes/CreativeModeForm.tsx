'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, Plus, X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CreativeModeFormProps {
  onResults?: (results: any[]) => void;
  className?: string;
}

export function CreativeModeForm({ onResults, className }: CreativeModeFormProps) {
  const [ingredients, setIngredients] = useState<string[]>(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle ingredient input change
  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };

  // Add another ingredient field (up to 10 total)
  const handleAddIngredient = () => {
    if (ingredients.length < 10) {
      setIngredients([...ingredients, '']);
    }
  };

  // Remove ingredient field (minimum 2)
  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 2) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  // Validate ingredients
  const validateIngredients = (): boolean => {
    const filledIngredients = ingredients.filter(ing => ing.trim().length > 0);

    if (filledIngredients.length < 2) {
      setValidationError('Please enter at least 2 ingredients');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);
    setValidationError(null);

    // Validate ingredients
    if (!validateIngredients()) {
      return;
    }

    // Filter out empty ingredients
    const filledIngredients = ingredients
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);

    setLoading(true);

    try {
      const response = await fetch('/api/recipes/creative-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: filledIngredients }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recipes');
      }

      // Pass results to parent component
      if (onResults) {
        onResults(data.results || []);
      }
    } catch (err) {
      console.error('Error fetching creative mode recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setIngredients(['', '', '']);
    setError(null);
    setValidationError(null);
    if (onResults) {
      onResults([]);
    }
  };

  return (
    <Card className={cn('bg-white shadow-farmhouse border-sage-green/20', className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Lightbulb className="h-6 w-6 text-sage-green" aria-hidden="true" />
          <div>
            <CardTitle className="text-2xl text-charcoal">Creative Mode</CardTitle>
            <CardDescription className="text-sage-green mt-1">
              Enter ingredients you want to use and discover creative recipe ideas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredients Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-charcoal">
                Your Ingredients
              </Label>
              <span className="text-sm text-charcoal/60">
                (minimum 2 required)
              </span>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      placeholder={`Ingredient ${index + 1} (e.g., chicken, tomatoes, basil)`}
                      className="border-sage-green/30 focus:border-sage-green focus:ring-sage-green"
                      disabled={loading}
                      aria-label={`Ingredient ${index + 1}`}
                    />
                  </div>

                  {/* Remove button (only show if more than 2 fields) */}
                  {ingredients.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveIngredient(index)}
                      disabled={loading}
                      className="border-charcoal/20 hover:bg-charcoal/5 text-charcoal"
                      aria-label={`Remove ingredient ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add ingredient button */}
            {ingredients.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddIngredient}
                disabled={loading}
                className="w-full border-sage-green/30 text-sage-green hover:bg-sage-green/5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Ingredient
              </Button>
            )}
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-start gap-2 p-3 bg-terracotta/10 border border-terracotta/30 rounded-md">
              <AlertCircle className="h-5 w-5 text-terracotta flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-terracotta">{validationError}</p>
            </div>
          )}

          {/* API Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-terracotta/10 border border-terracotta/30 rounded-md">
              <AlertCircle className="h-5 w-5 text-terracotta flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-terracotta">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sage-green hover:bg-sage-green/90 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finding Recipes...
                </>
              ) : (
                'Find Recipes'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="border-charcoal/20 hover:bg-charcoal/5 text-charcoal"
            >
              Reset
            </Button>
          </div>

          {/* Helper text */}
          <div className="text-sm text-charcoal/60 bg-light-beige/50 p-4 rounded-md border border-sage-green/10">
            <p className="font-medium text-charcoal mb-1">Tips for better results:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use common ingredient names (e.g., "chicken breast" instead of "poultry")</li>
              <li>Be specific when needed (e.g., "fresh basil" vs "dried basil")</li>
              <li>Mix proteins, vegetables, and seasonings for more variety</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
