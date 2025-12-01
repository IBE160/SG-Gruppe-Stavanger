/**
 * Ingredient Matching Logic
 *
 * This module provides fuzzy matching between recipe ingredients and user's inventory.
 * It handles name variations and provides confidence scores for matches.
 */

import logger from './logger';

export interface RecipeIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  bestBeforeDate: Date;
}

export interface MatchedIngredient extends RecipeIngredient {
  inventoryItemId?: string;
  available: boolean;
  matchConfidence?: number; // 0-1 score
}

export interface IngredientMatchResult {
  matched: MatchedIngredient[];
  missing: MatchedIngredient[];
}

/**
 * Normalize ingredient name for comparison
 */
function normalizeIngredientName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    // Remove common qualifiers
    .replace(/\b(fresh|frozen|canned|dried|chopped|minced|sliced|diced)\b/g, '')
    // Remove plurals
    .replace(/s\b/g, '')
    // Remove punctuation
    .replace(/[^a-z0-9\s]/g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0;

  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLength;
}

/**
 * Find best match for an ingredient in the inventory
 */
function findBestMatch(
  ingredient: RecipeIngredient,
  inventory: FoodItem[]
): { item: FoodItem; confidence: number } | null {
  const normalizedIngredient = normalizeIngredientName(ingredient.name);

  let bestMatch: FoodItem | null = null;
  let bestScore = 0;
  const MATCH_THRESHOLD = 0.6; // Minimum similarity score to consider a match

  for (const item of inventory) {
    const normalizedItem = normalizeIngredientName(item.name);

    // Check for exact match first
    if (normalizedIngredient === normalizedItem) {
      return { item, confidence: 1.0 };
    }

    // Check if ingredient name contains item name or vice versa
    if (normalizedIngredient.includes(normalizedItem) || normalizedItem.includes(normalizedIngredient)) {
      const confidence = 0.9;
      if (confidence > bestScore) {
        bestScore = confidence;
        bestMatch = item;
      }
      continue;
    }

    // Calculate fuzzy match score
    const similarity = calculateSimilarity(normalizedIngredient, normalizedItem);

    if (similarity > bestScore && similarity >= MATCH_THRESHOLD) {
      bestScore = similarity;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore >= MATCH_THRESHOLD) {
    return { item: bestMatch, confidence: bestScore };
  }

  return null;
}

/**
 * Match recipe ingredients against user's inventory
 */
export function matchIngredients(
  recipeIngredients: RecipeIngredient[],
  inventoryItems: FoodItem[]
): IngredientMatchResult {
  logger.info(`Matching ${recipeIngredients.length} ingredients against ${inventoryItems.length} inventory items`);

  const matched: MatchedIngredient[] = [];
  const missing: MatchedIngredient[] = [];

  for (const ingredient of recipeIngredients) {
    const match = findBestMatch(ingredient, inventoryItems);

    if (match) {
      matched.push({
        ...ingredient,
        inventoryItemId: match.item.id,
        available: true,
        matchConfidence: match.confidence,
      });
      logger.info(`Matched ingredient "${ingredient.name}" to inventory item "${match.item.name}" (confidence: ${match.confidence.toFixed(2)})`);
    } else {
      missing.push({
        ...ingredient,
        available: false,
      });
      logger.info(`No match found for ingredient "${ingredient.name}"`);
    }
  }

  logger.info(`Matching complete: ${matched.length} matched, ${missing.length} missing`);

  return { matched, missing };
}
