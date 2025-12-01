'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Users, ChefHat, ExternalLink, AlertCircle, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IngredientMatchIndicator } from './IngredientMatchIndicator';
import { CookingModePanel } from './CookingModePanel';
import { CookingConfirmationDialog } from './CookingConfirmationDialog';
import { UpdateSummary, UpdatedItem, Warning } from './UpdateSummary';
import { RecipeDetail } from '@/lib/spoonacular-client';
import { matchIngredients, MatchedIngredient, FoodItem } from '@/lib/ingredient-matcher';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface RecipeDetailViewProps {
  recipe: RecipeDetail;
}

export function RecipeDetailView({ recipe }: RecipeDetailViewProps) {
  const router = useRouter();
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [matchedIngredients, setMatchedIngredients] = useState<MatchedIngredient[]>([]);
  const [cookingModeActive, setCookingModeActive] = useState(false);
  const [addingToList, setAddingToList] = useState<Set<number>>(new Set());

  // State for "I Cooked This" feature
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmingCooking, setConfirmingCooking] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [updatedItems, setUpdatedItems] = useState<UpdatedItem[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);

  // Fetch user's inventory
  useEffect(() => {
    async function fetchInventory() {
      try {
        setLoadingInventory(true);
        setInventoryError(null);

        const response = await fetch('/api/inventory');

        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }

        const data = await response.json();
        setInventory(data.foodItems || []);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setInventoryError('Unable to load inventory');
      } finally {
        setLoadingInventory(false);
      }
    }

    fetchInventory();
  }, []);

  // Match ingredients when inventory loads
  useEffect(() => {
    if (!loadingInventory && inventory.length >= 0) {
      const recipeIngredients = recipe.extendedIngredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        original: ing.original,
      }));

      const matchResult = matchIngredients(recipeIngredients, inventory);

      // Combine matched and missing ingredients, preserving order
      const allIngredients = [...matchResult.matched, ...matchResult.missing];
      setMatchedIngredients(allIngredients);
    }
  }, [recipe.extendedIngredients, inventory, loadingInventory]);

  const handleAddToShoppingList = async (ingredient: MatchedIngredient) => {
    // Add to set of ingredients being added
    setAddingToList((prev) => new Set(prev).add(ingredient.id));

    try {
      const response = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          recipeId: recipe.id,
          recipeName: recipe.title,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add to shopping list');
      }

      const data = await response.json();
      console.log(`Added ${ingredient.name} to shopping list:`, data.message);
      // Success! Could show a toast notification here
    } catch (error) {
      console.error('Error adding to shopping list:', error);
      // Show error feedback - could use a toast notification
      alert(`Failed to add ${ingredient.name} to shopping list. Please try again.`);
    } finally {
      setAddingToList((prev) => {
        const updated = new Set(prev);
        updated.delete(ingredient.id);
        return updated;
      });
    }
  };

  const handleStartCooking = () => {
    setCookingModeActive(true);
  };

  const handleCloseCookingMode = () => {
    setCookingModeActive(false);
  };

  const handleCookingComplete = () => {
    // Could track this in database or show completion message
    console.log('Cooking completed!');
  };

  const handleCookedThisClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmCooking = async () => {
    setConfirmingCooking(true);

    try {
      const response = await fetch('/api/inventory/consume-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe.id,
          servings: recipe.servings,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update inventory');
      }

      const data = await response.json();

      // Store the results
      setUpdatedItems(data.updatedItems || []);
      setWarnings(data.warnings || []);

      // Close confirmation dialog
      setConfirmDialogOpen(false);

      // Show summary
      setSummaryOpen(true);

      // Refresh inventory to reflect changes
      const inventoryResponse = await fetch('/api/inventory');
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json();
        setInventory(inventoryData.foodItems || []);
      }
    } catch (error) {
      console.error('Error confirming cooking:', error);
      alert(`Failed to update inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setConfirmingCooking(false);
    }
  };

  const handleViewPantry = () => {
    router.push('/pantry');
  };

  // Parse HTML summary if needed
  const cleanSummary = recipe.summary
    ? recipe.summary.replace(/<[^>]*>/g, '')
    : '';

  // Count available vs missing ingredients
  const availableCount = matchedIngredients.filter((ing) => ing.available).length;
  const missingCount = matchedIngredients.filter((ing) => !ing.available).length;

  return (
    <>
      <div className="space-y-6">
        {/* Recipe Header */}
        <Card className="bg-white shadow-farmhouse border-sage-green/20">
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Recipe Image */}
              <div className="relative w-full lg:w-96 h-64 lg:h-80 rounded-lg overflow-hidden bg-light-beige flex-shrink-0">
                {recipe.image ? (
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 384px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sage-green">
                    <span className="text-6xl">🍽️</span>
                  </div>
                )}
              </div>

              {/* Recipe Info */}
              <div className="flex-grow space-y-4">
                <div>
                  <CardTitle className="text-3xl lg:text-4xl text-charcoal mb-2">
                    {recipe.title}
                  </CardTitle>
                  {cleanSummary && (
                    <CardDescription className="text-base text-charcoal/70 line-clamp-3">
                      {cleanSummary}
                    </CardDescription>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-sage-green">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-charcoal/70">Ready in</p>
                      <p className="text-lg font-semibold text-charcoal">
                        {recipe.readyInMinutes} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sage-green">
                    <Users className="h-5 w-5" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-charcoal/70">Servings</p>
                      <p className="text-lg font-semibold text-charcoal">
                        {recipe.servings}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Source Link */}
                {recipe.sourceUrl && (
                  <div className="pt-2">
                    <a
                      href={recipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-sage-green hover:text-sage-green/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      View Original Recipe
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={handleStartCooking}
                    className="bg-sage-green hover:bg-sage-green/90 text-white"
                  >
                    <ChefHat className="h-5 w-5 mr-2" aria-hidden="true" />
                    Start Cooking Mode
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleCookedThisClick}
                    className="border-sage-green text-sage-green hover:bg-sage-green/10"
                  >
                    <Utensils className="h-5 w-5 mr-2" aria-hidden="true" />
                    I Cooked This
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Ingredients Section */}
        <Card className="bg-white shadow-farmhouse border-sage-green/20">
          <CardHeader className="border-b border-sage-green/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-charcoal">Ingredients</CardTitle>
              {!loadingInventory && matchedIngredients.length > 0 && (
                <div className="text-sm text-charcoal/70">
                  <span className="text-sage-green font-semibold">{availableCount}</span> available,{' '}
                  <span className="text-terracotta font-semibold">{missingCount}</span> missing
                </div>
              )}
            </div>
            {!loadingInventory && inventoryError && (
              <div className="flex items-center gap-2 text-terracotta text-sm mt-2">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <span>{inventoryError}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            {loadingInventory ? (
              <div className="flex justify-center items-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-green" />
                  <p className="text-sm text-charcoal/70">Checking your inventory...</p>
                </div>
              </div>
            ) : matchedIngredients.length > 0 ? (
              <IngredientMatchIndicator
                ingredients={matchedIngredients}
                onAddToShoppingList={handleAddToShoppingList}
                addingToList={addingToList}
              />
            ) : (
              <div className="text-center py-8 text-charcoal/70">
                No ingredients listed for this recipe.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <Card className="bg-white shadow-farmhouse border-sage-green/20">
          <CardHeader className="border-b border-sage-green/10">
            <CardTitle className="text-2xl text-charcoal">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {recipe.instructions ? (
              <div
                className="prose prose-charcoal max-w-none"
                dangerouslySetInnerHTML={{ __html: recipe.instructions }}
              />
            ) : (
              <div className="text-center py-8 text-charcoal/70">
                No instructions available. Please check the original recipe source.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cooking Mode Panel */}
      {cookingModeActive && (
        <CookingModePanel
          instructions={recipe.instructions}
          recipeTitle={recipe.title}
          onClose={handleCloseCookingMode}
          onComplete={handleCookingComplete}
        />
      )}

      {/* Cooking Confirmation Dialog */}
      <CookingConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        recipeTitle={recipe.title}
        recipeServings={recipe.servings}
        onConfirm={handleConfirmCooking}
        isLoading={confirmingCooking}
      />

      {/* Update Summary Dialog */}
      <UpdateSummary
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        updatedItems={updatedItems}
        warnings={warnings}
        onViewPantry={handleViewPantry}
      />
    </>
  );
}
