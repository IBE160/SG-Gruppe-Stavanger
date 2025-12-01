import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { spoonacularClient } from '@/lib/spoonacular-client';
import logger from '@/lib/logger';

/**
 * POST /api/recipes/creative-mode
 * Get recipe suggestions based on manually entered ingredients
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      logger.warn('Unauthorized creative mode request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      logger.warn(`Invalid JSON in creative mode request from user ${userId}`);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Extract and validate ingredients
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      logger.warn(`Invalid ingredients format from user ${userId}`);
      return NextResponse.json(
        { error: 'Ingredients must be an array' },
        { status: 400 }
      );
    }

    // Filter out empty strings and trim whitespace
    const cleanedIngredients = ingredients
      .map((ing: any) => (typeof ing === 'string' ? ing.trim() : ''))
      .filter((ing: string) => ing.length > 0);

    // Validate minimum 2 ingredients
    if (cleanedIngredients.length < 2) {
      logger.warn(`Insufficient ingredients from user ${userId}: ${cleanedIngredients.length}`);
      return NextResponse.json(
        { error: 'At least 2 ingredients are required' },
        { status: 400 }
      );
    }

    logger.info(`Creative mode request from user ${userId} with ingredients: ${cleanedIngredients.join(', ')}`);

    // Query Spoonacular API using findByIngredients
    let spoonacularResults;
    try {
      spoonacularResults = await spoonacularClient.findByIngredients(
        cleanedIngredients,
        10 // Request 10 recipes
      );
    } catch (error) {
      logger.error(`Spoonacular API error for user ${userId}: ${error}`);

      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          return NextResponse.json(
            { error: error.message },
            { status: 429 }
          );
        } else if (error.message.includes('not configured')) {
          return NextResponse.json(
            { error: 'Recipe service is not configured' },
            { status: 503 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Recipe service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Transform results to include readyInMinutes and servings from detail endpoint
    // For now, we'll return the basic info and let the frontend handle detail fetching
    const results = spoonacularResults.suggestions.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredientCount: recipe.usedIngredientCount,
      missedIngredientCount: recipe.missedIngredientCount,
      usedIngredients: recipe.usedIngredients,
      missedIngredients: recipe.missedIngredients,
      likes: recipe.likes,
    }));

    logger.info(`Returning ${results.length} creative mode recipes for user ${userId}`);

    return NextResponse.json({
      results,
      totalResults: results.length,
    });
  } catch (error) {
    logger.error(`Error in creative mode endpoint: ${error}`);
    return NextResponse.json(
      { error: 'Failed to fetch recipe suggestions' },
      { status: 500 }
    );
  }
}
