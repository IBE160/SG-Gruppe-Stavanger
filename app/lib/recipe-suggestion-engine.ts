import logger from './logger';
import { RecipeSuggestion } from './spoonacular-client';

/**
 * Ranked recipe interface with scoring
 */
export interface RankedRecipe extends RecipeSuggestion {
  score: number;
  usesExpiringIngredients: boolean;
  readyInMinutes?: number;
  servings?: number;
}

/**
 * Food item from inventory
 */
export interface InventoryItem {
  name: string;
  bestBeforeDate: Date;
}

/**
 * Recipe Suggestion Engine
 * Handles ranking and prioritization of recipe suggestions
 */
export class RecipeSuggestionEngine {
  private static readonly EXPIRATION_THRESHOLD_DAYS = 5;
  private static readonly EXPIRING_INGREDIENT_BONUS = 50;
  private static readonly USED_INGREDIENT_WEIGHT = 10;
  private static readonly MISSED_INGREDIENT_PENALTY = 5;
  private static readonly LIKES_WEIGHT = 0.1;

  /**
   * Identify ingredients that are nearing expiration
   */
  static identifyExpiringIngredients(inventory: InventoryItem[]): string[] {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + this.EXPIRATION_THRESHOLD_DAYS);

    const expiring = inventory
      .filter(item => {
        const expirationDate = new Date(item.bestBeforeDate);
        return expirationDate >= now && expirationDate <= thresholdDate;
      })
      .map(item => item.name.toLowerCase());

    logger.info(`Identified ${expiring.length} expiring ingredients: ${expiring.join(', ')}`);

    return expiring;
  }

  /**
   * Check if a recipe uses any expiring ingredients
   */
  static usesExpiringIngredients(
    recipe: RecipeSuggestion,
    expiringIngredients: string[]
  ): boolean {
    if (expiringIngredients.length === 0) {
      return false;
    }

    return recipe.usedIngredients.some(ingredient => {
      const ingredientName = ingredient.name.toLowerCase();
      return expiringIngredients.some(expiring =>
        ingredientName.includes(expiring) || expiring.includes(ingredientName)
      );
    });
  }

  /**
   * Calculate score for a recipe
   */
  static calculateScore(
    recipe: RecipeSuggestion,
    usesExpiring: boolean
  ): number {
    let score = 0;

    // Higher score for more used ingredients
    score += recipe.usedIngredientCount * this.USED_INGREDIENT_WEIGHT;

    // Penalty for missed ingredients (lower is better)
    score -= recipe.missedIngredientCount * this.MISSED_INGREDIENT_PENALTY;

    // Bonus for using expiring ingredients
    if (usesExpiring) {
      score += this.EXPIRING_INGREDIENT_BONUS;
    }

    // Small bonus for popular recipes
    score += recipe.likes * this.LIKES_WEIGHT;

    return score;
  }

  /**
   * Rank recipe suggestions based on multiple criteria
   */
  static rankSuggestions(
    recipes: RecipeSuggestion[],
    expiringIngredients: string[]
  ): RankedRecipe[] {
    logger.info(`Ranking ${recipes.length} recipe suggestions`);

    const rankedRecipes: RankedRecipe[] = recipes.map(recipe => {
      const usesExpiring = this.usesExpiringIngredients(recipe, expiringIngredients);
      const score = this.calculateScore(recipe, usesExpiring);

      return {
        ...recipe,
        score,
        usesExpiringIngredients: usesExpiring,
      };
    });

    // Sort by score descending (higher is better)
    rankedRecipes.sort((a, b) => b.score - a.score);

    logger.info(
      `Top 3 ranked recipes: ${rankedRecipes
        .slice(0, 3)
        .map(r => `${r.title} (score: ${r.score})`)
        .join(', ')}`
    );

    return rankedRecipes;
  }

  /**
   * Extract ingredient names from inventory
   */
  static extractIngredientNames(inventory: InventoryItem[]): string[] {
    return inventory.map(item => item.name);
  }

  /**
   * Filter inventory to prioritize expiring ingredients
   */
  static prioritizeIngredients(
    inventory: InventoryItem[],
    maxIngredients: number = 20
  ): string[] {
    const expiringIngredients = this.identifyExpiringIngredients(inventory);
    const allIngredients = this.extractIngredientNames(inventory);

    // Get expiring ingredients first
    const expiring = allIngredients.filter(name =>
      expiringIngredients.includes(name.toLowerCase())
    );

    // Get remaining non-expiring ingredients
    const remaining = allIngredients.filter(
      name => !expiringIngredients.includes(name.toLowerCase())
    );

    // Combine: expiring first, then others, up to max
    const prioritized = [...expiring, ...remaining].slice(0, maxIngredients);

    logger.info(
      `Prioritized ${prioritized.length} ingredients (${expiring.length} expiring)`
    );

    return prioritized;
  }
}
