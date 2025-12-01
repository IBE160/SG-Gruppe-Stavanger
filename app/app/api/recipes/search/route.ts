import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { spoonacularClient } from '@/lib/spoonacular-client';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to search recipes');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || undefined;
    const numberParam = searchParams.get('number');
    const offsetParam = searchParams.get('offset');

    // Parse and validate number parameter
    const number = numberParam ? parseInt(numberParam, 10) : 10;
    if (isNaN(number) || number < 1 || number > 100) {
      logger.warn(`Invalid number parameter: ${numberParam}`);
      return NextResponse.json(
        { error: 'Invalid number parameter. Must be between 1 and 100.' },
        { status: 400 }
      );
    }

    // Parse and validate offset parameter
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
    if (isNaN(offset) || offset < 0) {
      logger.warn(`Invalid offset parameter: ${offsetParam}`);
      return NextResponse.json(
        { error: 'Invalid offset parameter. Must be >= 0.' },
        { status: 400 }
      );
    }

    logger.info(`Searching recipes for user ${session.user.id}: query="${query || 'popular'}", number=${number}, offset=${offset}`);

    // Search recipes using Spoonacular client
    const result = await spoonacularClient.searchRecipes(query, number, offset);

    logger.info(`Found ${result.results.length} recipes for user ${session.user.id}`);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
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

    logger.error(`Error searching recipes: ${error}`);
    return NextResponse.json(
      { error: 'Failed to search recipes' },
      { status: 500 }
    );
  }
}
