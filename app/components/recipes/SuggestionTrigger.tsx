'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, AlertCircle, Package, Loader2 } from 'lucide-react';
import { RecipeSuggestionList, RecipeSuggestion } from './RecipeSuggestionList';
import { useRouter } from 'next/navigation';

export function SuggestionTrigger() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      setSuggestions([]);

      const response = await fetch('/api/recipes/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setMessage(data.message || null);
      setHasRequested(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load suggestions');
      setSuggestions([]);
      setHasRequested(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRecipeClick = useCallback(
    (recipeId: number) => {
      router.push(`/recipes/${recipeId}`);
    },
    [router]
  );

  return (
    <Card className="bg-gradient-to-br from-sage-green/5 to-light-beige/50 shadow-farmhouse border-sage-green/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sage-green/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-sage-green" aria-hidden="true" />
          </div>
          <div>
            <CardTitle className="text-2xl text-charcoal">Recipes from My Pantry</CardTitle>
            <CardDescription className="text-sage-green mt-1">
              Get personalized recipe suggestions based on your available ingredients
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trigger Button */}
        {!hasRequested && (
          <Button
            onClick={fetchSuggestions}
            disabled={loading}
            className="w-full bg-sage-green hover:bg-sage-green/90 text-white font-semibold py-6 text-lg shadow-md transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                Finding recipes...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
                Get Recipe Suggestions
              </>
            )}
          </Button>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 animate-spin text-sage-green" aria-hidden="true" />
              <p className="text-charcoal font-medium">Analyzing your pantry...</p>
              <p className="text-sm text-charcoal/70">Finding the best recipes for you</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle className="h-12 w-12 text-terracotta" aria-hidden="true" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-charcoal">Unable to Load Suggestions</h3>
              <p className="text-sm text-charcoal/70 mt-1">{error}</p>
              <Button
                onClick={fetchSuggestions}
                className="mt-4 bg-sage-green hover:bg-sage-green/90 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Empty State with Message */}
        {!loading && !error && message && suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Package className="h-12 w-12 text-sage-green/50" aria-hidden="true" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-charcoal">No Suggestions Available</h3>
              <p className="text-sm text-charcoal/70 mt-1">{message}</p>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => router.push('/pantry')}
                  className="bg-sage-green hover:bg-sage-green/90 text-white"
                >
                  Go to Pantry
                </Button>
                <Button
                  onClick={fetchSuggestions}
                  variant="outline"
                  className="border-sage-green/30 text-charcoal hover:bg-sage-green/5"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions List */}
        {!loading && !error && suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-charcoal">
                  Your Personalized Suggestions
                </h3>
                <p className="text-sm text-charcoal/70 mt-1">
                  {suggestions.length} {suggestions.length === 1 ? 'recipe' : 'recipes'} found
                </p>
              </div>
              <Button
                onClick={fetchSuggestions}
                variant="outline"
                size="sm"
                className="border-sage-green/30 text-charcoal hover:bg-sage-green/5"
              >
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                Refresh
              </Button>
            </div>

            <RecipeSuggestionList
              suggestions={suggestions}
              onRecipeClick={handleRecipeClick}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
