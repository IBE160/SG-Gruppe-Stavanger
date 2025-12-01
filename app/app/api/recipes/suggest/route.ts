import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { spoonacularClient } from '@/lib/spoonacular-client';
import { RecipeSuggestionEngine, InventoryItem } from '@/lib/recipe-suggestion-engine';
import { prisma } from '@/lib/prisma';
import logger from '@/lib/logger';

/**
 * POST /api/recipes/suggest
 * Get recipe suggestions based on user's inventory
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      logger.warn('Unauthorized recipe suggestion request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    logger.info(`Recipe suggestion request from user: ${userId}`);

    // Query user's inventory
    const inventory = await prisma.foodItem.findMany({
      where: { userId },
      select: {
        name: true,
        bestBeforeDate: true,
      },
    });

    // Handle empty inventory
    if (inventory.length === 0) {
      logger.info(`User ${userId} has empty inventory`);
      return NextResponse.json({
        suggestions: [],
        totalResults: 0,
        message: 'No items in your pantry. Add some ingredients to get suggestions!',
      });
    }

    // Convert to InventoryItem format
    const inventoryItems: InventoryItem[] = inventory.map(item => ({
      name: item.name,
      bestBeforeDate: item.bestBeforeDate,
    }));

    // Identify expiring ingredients
    const expiringIngredients = RecipeSuggestionEngine.identifyExpiringIngredients(
      inventoryItems
    );

    // Prioritize ingredients (expiring first)
    const prioritizedIngredients = RecipeSuggestionEngine.prioritizeIngredients(
      inventoryItems,
      20 // Max 20 ingredients to avoid API limits
    );

    // Query Spoonacular API
    let spoonacularResults;
    try {
      spoonacularResults = await spoonacularClient.findByIngredients(
        prioritizedIngredients,
        10 // Request 10 recipes
      );
    } catch (error) {
      logger.error(`Spoonacular API error: ${error}`);
      return NextResponse.json(
        {
          error: 'Recipe service temporarily unavailable. Please try again later.',
        },
        { status: 503 }
      );
    }

    // Handle no results
    if (spoonacularResults.suggestions.length === 0) {
      logger.info(`No recipe suggestions found for user ${userId}`);
      return NextResponse.json({
        suggestions: [],
        totalResults: 0,
        message: 'No recipes found with your available ingredients. Try adding more items to your pantry!',
      });
    }

    // Rank suggestions
    const rankedSuggestions = RecipeSuggestionEngine.rankSuggestions(
      spoonacularResults.suggestions,
      expiringIngredients
    );

    // Take top suggestions (at least 3 if available)
    const topSuggestions = rankedSuggestions.slice(0, Math.max(3, rankedSuggestions.length));

    logger.info(
      `Returning ${topSuggestions.length} recipe suggestions for user ${userId}`
    );

    return NextResponse.json({
      suggestions: topSuggestions,
      totalResults: topSuggestions.length,
    });
  } catch (error) {
    logger.error(`Error generating recipe suggestions: ${error}`);
    return NextResponse.json(
      {
        error: 'Failed to generate recipe suggestions',
      },
      { status: 500 }
    );
  }
}
