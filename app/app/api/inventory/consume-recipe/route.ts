import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/prisma-client';
import logger from '@/lib/logger';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { spoonacularClient } from '@/lib/spoonacular-client';
import { matchIngredients, RecipeIngredient, FoodItem } from '@/lib/ingredient-matcher';
import { calculateDeduction } from '@/lib/quantity-calculator';

interface ConsumeRecipeRequest {
  recipeId: number;
  servings?: number;
}

interface UpdatedItem {
  id: string;
  name: string;
  previousQuantity: number;
  newQuantity: number;
  unit: string;
}

interface Warning {
  item: string;
  message: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      logger.warn('Unauthorized attempt to consume recipe inventory');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse and validate request body
    const body: ConsumeRecipeRequest = await request.json();

    if (!body.recipeId || typeof body.recipeId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request: recipeId is required and must be a number' },
        { status: 400 }
      );
    }

    const servings = body.servings && body.servings > 0 ? body.servings : undefined;

    logger.info(`User ${userId} consuming recipe ${body.recipeId} for ${servings || 'default'} servings`);

    // Fetch recipe details from Spoonacular (with caching)
    let recipe;
    try {
      recipe = await spoonacularClient.getRecipeById(body.recipeId);
    } catch (error) {
      logger.error(`Error fetching recipe ${body.recipeId}: ${error}`);
      return NextResponse.json(
        { error: 'Failed to fetch recipe details' },
        { status: 500 }
      );
    }

    // Fetch user's inventory
    const inventory = await prisma.foodItem.findMany({
      where: {
        userId,
      },
    });

    logger.info(`Found ${inventory.length} items in user's inventory`);

    // Transform recipe ingredients to the format expected by matcher
    const recipeIngredients: RecipeIngredient[] = recipe.extendedIngredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      original: ing.original,
    }));

    // Transform inventory to the format expected by matcher
    const inventoryItems: FoodItem[] = inventory.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      bestBeforeDate: item.bestBeforeDate,
    }));

    // Match recipe ingredients with inventory
    const matchResult = matchIngredients(recipeIngredients, inventoryItems);

    logger.info(`Matched ${matchResult.matched.length} ingredients, ${matchResult.missing.length} missing`);

    // Calculate deductions and prepare updates
    const updatedItems: UpdatedItem[] = [];
    const warnings: Warning[] = [];
    const updates: Array<{ id: string; newQuantity: number }> = [];

    const actualServings = servings || recipe.servings || 1;
    const recipeServings = recipe.servings || 1;

    for (const matchedIng of matchResult.matched) {
      // Find the inventory item
      const inventoryItem = inventory.find((item) => item.id === matchedIng.inventoryItemId);

      if (!inventoryItem) {
        logger.warn(`Matched ingredient ${matchedIng.name} has no inventory item`);
        continue;
      }

      // Calculate deduction
      const deduction = calculateDeduction(
        matchedIng.amount,
        matchedIng.unit,
        inventoryItem.quantity,
        inventoryItem.unit,
        actualServings,
        recipeServings
      );

      // Record the update
      updates.push({
        id: inventoryItem.id,
        newQuantity: deduction.remainingQuantity,
      });

      updatedItems.push({
        id: inventoryItem.id,
        name: inventoryItem.name,
        previousQuantity: inventoryItem.quantity,
        newQuantity: deduction.remainingQuantity,
        unit: inventoryItem.unit,
      });

      // Add warning if insufficient quantity
      if (!deduction.sufficient) {
        warnings.push({
          item: inventoryItem.name,
          message: `Insufficient quantity. Required ${matchedIng.amount} ${matchedIng.unit}, but only ${inventoryItem.quantity} ${inventoryItem.unit} available.`,
        });
      }

      logger.info(
        `${inventoryItem.name}: ${inventoryItem.quantity} -> ${deduction.remainingQuantity} ${inventoryItem.unit} (sufficient: ${deduction.sufficient})`
      );
    }

    // Log missing ingredients as warnings
    for (const missing of matchResult.missing) {
      warnings.push({
        item: missing.name,
        message: `Not found in inventory. Please add ${missing.amount} ${missing.unit} to shopping list.`,
      });
    }

    // Perform atomic update using Prisma transaction
    try {
      await prisma.$transaction(async (tx) => {
        for (const update of updates) {
          await tx.foodItem.update({
            where: { id: update.id },
            data: { quantity: update.newQuantity },
          });
        }
      });

      logger.info(`Successfully updated ${updates.length} inventory items`);
    } catch (error) {
      logger.error(`Error updating inventory: ${error}`);
      return NextResponse.json(
        { error: 'Failed to update inventory' },
        { status: 500 }
      );
    }

    const executionTime = Date.now() - startTime;
    logger.info(`Recipe consumption completed in ${executionTime}ms`);

    // Check performance requirement (<1s)
    if (executionTime > 1000) {
      logger.warn(`Performance warning: Recipe consumption took ${executionTime}ms (>1s)`);
    }

    return NextResponse.json(
      {
        message: 'Inventory updated successfully',
        updatedItems,
        warnings,
        executionTime,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`Error in consume-recipe endpoint: ${error}`);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
