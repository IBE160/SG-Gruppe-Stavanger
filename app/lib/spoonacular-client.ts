import NodeCache from 'node-cache';
import logger from './logger';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';
const CACHE_TTL = 3600; // 1 hour in seconds
const RATE_LIMIT_DELAY = 100; // 100ms between requests

// Initialize cache with 1-hour TTL
const cache = new NodeCache({ stdTTL: CACHE_TTL });

// Rate limiting state
let lastRequestTime = 0;

/**
 * Rate limiter to prevent API abuse
 */
async function rateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();
}

/**
 * Recipe search result interface
 */
export interface RecipeSearchResult {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

/**
 * Recipe search response interface
 */
export interface RecipeSearchResponse {
  results: RecipeSearchResult[];
  totalResults: number;
}

/**
 * Detailed recipe interface
 */
export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  extendedIngredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }[];
  instructions: string;
  sourceUrl: string;
  summary?: string;
}

/**
 * Spoonacular API Client
 */
export class SpoonacularClient {
  /**
   * Search for recipes by query
   */
  async searchRecipes(
    query?: string,
    number: number = 10,
    offset: number = 0
  ): Promise<RecipeSearchResponse> {
    if (!SPOONACULAR_API_KEY) {
      logger.error('Spoonacular API key is not configured');
      throw new Error('Spoonacular API key is not configured');
    }

    // Create cache key
    const cacheKey = `search:${query || 'popular'}:${number}:${offset}`;

    // Check cache first
    const cachedResult = cache.get<RecipeSearchResponse>(cacheKey);
    if (cachedResult) {
      logger.info(`Cache hit for recipe search: ${cacheKey}`);
      return cachedResult;
    }

    // Apply rate limiting
    await rateLimit();

    try {
      // Build URL with query parameters
      const params = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
        number: number.toString(),
        offset: offset.toString(),
        addRecipeInformation: 'true',
      });

      if (query) {
        params.append('query', query);
      }

      const url = `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`;

      logger.info(`Fetching recipes from Spoonacular: ${query || 'popular'}`);

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 402) {
          logger.error('Spoonacular API rate limit exceeded');
          throw new Error('Recipe search rate limit exceeded. Please try again later.');
        } else if (response.status === 401) {
          logger.error('Spoonacular API authentication failed');
          throw new Error('Recipe API authentication failed');
        } else {
          logger.error(`Spoonacular API error: ${response.status} ${response.statusText}`);
          throw new Error('Recipe search service unavailable');
        }
      }

      const data = await response.json();

      // Transform the response to match our interface
      const result: RecipeSearchResponse = {
        results: data.results.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image || '',
          readyInMinutes: recipe.readyInMinutes || 0,
          servings: recipe.servings || 0,
        })),
        totalResults: data.totalResults || 0,
      };

      // Cache the result
      cache.set(cacheKey, result);
      logger.info(`Cached recipe search result: ${cacheKey}`);

      return result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate limit')) {
        throw error;
      }
      logger.error(`Error searching recipes: ${error}`);
      throw new Error('Failed to search recipes');
    }
  }

  /**
   * Get detailed information about a specific recipe
   */
  async getRecipeById(id: number): Promise<RecipeDetail> {
    if (!SPOONACULAR_API_KEY) {
      logger.error('Spoonacular API key is not configured');
      throw new Error('Spoonacular API key is not configured');
    }

    // Create cache key
    const cacheKey = `recipe:${id}`;

    // Check cache first
    const cachedResult = cache.get<RecipeDetail>(cacheKey);
    if (cachedResult) {
      logger.info(`Cache hit for recipe detail: ${id}`);
      return cachedResult;
    }

    // Apply rate limiting
    await rateLimit();

    try {
      const url = `${SPOONACULAR_BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`;

      logger.info(`Fetching recipe detail from Spoonacular: ${id}`);

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          logger.warn(`Recipe not found: ${id}`);
          throw new Error('Recipe not found');
        } else if (response.status === 402) {
          logger.error('Spoonacular API rate limit exceeded');
          throw new Error('Recipe service rate limit exceeded. Please try again later.');
        } else if (response.status === 401) {
          logger.error('Spoonacular API authentication failed');
          throw new Error('Recipe API authentication failed');
        } else {
          logger.error(`Spoonacular API error: ${response.status} ${response.statusText}`);
          throw new Error('Recipe service unavailable');
        }
      }

      const data = await response.json();

      // Transform the response to match our interface
      const result: RecipeDetail = {
        id: data.id,
        title: data.title,
        image: data.image || '',
        readyInMinutes: data.readyInMinutes || 0,
        servings: data.servings || 0,
        extendedIngredients: (data.extendedIngredients || []).map((ing: any) => ({
          id: ing.id,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
          original: ing.original,
        })),
        instructions: data.instructions || '',
        sourceUrl: data.sourceUrl || '',
        summary: data.summary || '',
      };

      // Cache the result
      cache.set(cacheKey, result);
      logger.info(`Cached recipe detail: ${id}`);

      return result;
    } catch (error) {
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('rate limit'))) {
        throw error;
      }
      logger.error(`Error fetching recipe detail: ${error}`);
      throw new Error('Failed to fetch recipe details');
    }
  }

  /**
   * Clear cache for testing purposes
   */
  clearCache(): void {
    cache.flushAll();
    logger.info('Spoonacular cache cleared');
  }
}

// Export singleton instance
export const spoonacularClient = new SpoonacularClient();
