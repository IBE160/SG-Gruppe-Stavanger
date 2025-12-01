import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { spoonacularClient } from '@/lib/spoonacular-client';
import logger from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to fetch recipe details');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get recipe ID from URL params
    const { id } = await params;
    const recipeId = parseInt(id, 10);

    if (isNaN(recipeId) || recipeId <= 0) {
      logger.warn(`Invalid recipe ID: ${id}`);
      return NextResponse.json(
        { error: 'Invalid recipe ID' },
        { status: 400 }
      );
    }

    logger.info(`Fetching recipe details for user ${session.user.id}: recipe ${recipeId}`);

    // Fetch recipe details using Spoonacular client
    const recipe = await spoonacularClient.getRecipeById(recipeId);

    logger.info(`Successfully fetched recipe ${recipeId} for user ${session.user.id}`);

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        logger.warn(`Recipe not found: ${error.message}`);
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      } else if (error.message.includes('rate limit')) {
        logger.error(`Rate limit error: ${error.message}`);
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        );
      } else if (error.message.includes('not configured')) {
        logger.error('Spoonacular API key not configured');
        return NextResponse.json(
          { error: 'Recipe service is not configured' },
          { status: 503 }
        );
      }
    }

    logger.error(`Error fetching recipe details: ${error}`);
    return NextResponse.json(
      { error: 'Failed to fetch recipe details' },
      { status: 500 }
    );
  }
}
