'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeSearchBar } from '@/components/recipes/RecipeSearchBar';
import { RecipeCard, Recipe } from '@/components/recipes/RecipeCard';
import { RecipePagination } from '@/components/recipes/RecipePagination';
import { SuggestionTrigger } from '@/components/recipes/SuggestionTrigger';
import { AlertCircle, ChefHat, Lightbulb } from 'lucide-react';
import NotificationBadge from '@/components/notifications/NotificationBadge';

const RESULTS_PER_PAGE = 12;

export default function RecipesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch recipes
  const fetchRecipes = useCallback(async (query: string, page: number) => {
    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * RESULTS_PER_PAGE;
      const params = new URLSearchParams({
        number: RESULTS_PER_PAGE.toString(),
        offset: offset.toString(),
      });

      if (query.trim()) {
        params.append('query', query.trim());
      }

      const response = await fetch(`/api/recipes/search?${params}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch recipes');
      }

      const data = await response.json();
      setRecipes(data.results || []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
      setRecipes([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial recipes when authenticated
  useEffect(() => {
    if (session) {
      fetchRecipes('', 1);
    }
  }, [session, fetchRecipes]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchRecipes(query, 1);
  }, [fetchRecipes]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchRecipes(searchQuery, page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery, fetchRecipes]);

  // Handle recipe click
  const handleRecipeClick = useCallback((recipe: Recipe) => {
    router.push(`/recipes/${recipe.id}`);
  }, [router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-light-beige">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green" />
          <p className="text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-beige p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-sage-green" aria-hidden="true" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">Recipe Library</h1>
              <p className="text-sm text-charcoal/70 mt-1">
                Discover delicious recipes for your next meal
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto items-center">
            <NotificationBadge />
            <Button
              onClick={() => router.push('/pantry')}
              variant="outline"
              className="text-charcoal border-charcoal/20 hover:bg-charcoal/5"
            >
              My Pantry
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="outline"
              className="text-charcoal border-charcoal/20 hover:bg-charcoal/5"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="bg-white shadow-farmhouse border-sage-green/20">
          <CardHeader>
            <CardTitle className="text-xl text-charcoal">Search Recipes</CardTitle>
            <CardDescription className="text-sage-green">
              Find recipes by ingredients, cuisine, or dish name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecipeSearchBar onSearch={handleSearch} />
          </CardContent>
        </Card>

        {/* Recipe Suggestions */}
        <SuggestionTrigger />

        {/* Creative Mode */}
        <Card className="bg-white shadow-farmhouse border-sage-green/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-sage-green" aria-hidden="true" />
              <div className="flex-1">
                <CardTitle className="text-xl text-charcoal">Creative Mode</CardTitle>
                <CardDescription className="text-sage-green">
                  Manually enter ingredients and discover creative recipe ideas
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push('/recipes/creative-mode')}
                className="bg-sage-green hover:bg-sage-green/90 text-white"
              >
                Try Creative Mode
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Card className="bg-white shadow-farmhouse border-sage-green/20">
          <CardHeader className="border-b border-sage-green/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-2xl text-charcoal">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Recipes'}
                </CardTitle>
                <CardDescription className="text-sage-green mt-1">
                  {loading ? 'Loading...' : `${totalResults} ${totalResults === 1 ? 'recipe' : 'recipes'} found`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <AlertCircle className="h-12 w-12 text-terracotta" aria-hidden="true" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-charcoal">Error Loading Recipes</h3>
                  <p className="text-sm text-charcoal/70 mt-1">{error}</p>
                  <Button
                    onClick={() => fetchRecipes(searchQuery, currentPage)}
                    className="mt-4 bg-sage-green hover:bg-sage-green/90 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green" />
                  <p className="text-charcoal">Loading recipes...</p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && recipes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <ChefHat className="h-12 w-12 text-sage-green/50" aria-hidden="true" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-charcoal">No Recipes Found</h3>
                  <p className="text-sm text-charcoal/70 mt-1">
                    {searchQuery
                      ? 'Try adjusting your search terms'
                      : 'Start by searching for your favorite dishes'}
                  </p>
                </div>
              </div>
            )}

            {/* Recipe Grid */}
            {!loading && !error && recipes.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={handleRecipeClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalResults > RESULTS_PER_PAGE && (
                  <RecipePagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    resultsPerPage={RESULTS_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
