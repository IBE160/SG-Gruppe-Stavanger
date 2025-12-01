import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RecipeDetailView } from '@/components/recipes/RecipeDetailView';
import { spoonacularClient } from '@/lib/spoonacular-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import logger from '@/lib/logger';

interface RecipeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Get recipe ID from params
  const { id } = await params;
  const recipeId = parseInt(id, 10);

  if (isNaN(recipeId) || recipeId <= 0) {
    logger.warn(`Invalid recipe ID: ${id}`);
    notFound();
  }

  // Fetch recipe data server-side
  let recipe;
  try {
    recipe = await spoonacularClient.getRecipeById(recipeId);
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      logger.warn(`Recipe not found: ${recipeId}`);
      notFound();
    }
    logger.error(`Error fetching recipe ${recipeId}:`, error);
    throw error;
  }

  return (
    <div className="min-h-screen bg-light-beige">
      <div className="mx-auto max-w-6xl p-4 sm:p-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/recipes">
            <Button
              variant="outline"
              className="text-charcoal border-charcoal/20 hover:bg-charcoal/5"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Recipes
            </Button>
          </Link>
        </div>

        {/* Recipe Detail View */}
        <RecipeDetailView recipe={recipe} />
      </div>
    </div>
  );
}
