/**
 * Quantity Calculation Logic
 *
 * This module handles quantity calculations for inventory consumption,
 * including unit normalization and deduction calculations.
 */

import logger from './logger';

export interface QuantityDeduction {
  deductAmount: number;
  sufficient: boolean;
  remainingQuantity: number;
}

/**
 * Unit conversion factors to a common base unit
 * This is a simplified approach - in production, consider using a library like convert-units
 */
const UNIT_CONVERSIONS: Record<string, { base: string; factor: number }> = {
  // Volume - base: ml
  'ml': { base: 'ml', factor: 1 },
  'milliliter': { base: 'ml', factor: 1 },
  'milliliters': { base: 'ml', factor: 1 },
  'l': { base: 'ml', factor: 1000 },
  'liter': { base: 'ml', factor: 1000 },
  'liters': { base: 'ml', factor: 1000 },
  'cup': { base: 'ml', factor: 236.588 },
  'cups': { base: 'ml', factor: 236.588 },
  'tablespoon': { base: 'ml', factor: 14.787 },
  'tablespoons': { base: 'ml', factor: 14.787 },
  'tbsp': { base: 'ml', factor: 14.787 },
  'teaspoon': { base: 'ml', factor: 4.929 },
  'teaspoons': { base: 'ml', factor: 4.929 },
  'tsp': { base: 'ml', factor: 4.929 },
  'fluid ounce': { base: 'ml', factor: 29.574 },
  'fluid ounces': { base: 'ml', factor: 29.574 },
  'fl oz': { base: 'ml', factor: 29.574 },
  'pint': { base: 'ml', factor: 473.176 },
  'pints': { base: 'ml', factor: 473.176 },
  'quart': { base: 'ml', factor: 946.353 },
  'quarts': { base: 'ml', factor: 946.353 },
  'gallon': { base: 'ml', factor: 3785.41 },
  'gallons': { base: 'ml', factor: 3785.41 },

  // Weight - base: g
  'g': { base: 'g', factor: 1 },
  'gram': { base: 'g', factor: 1 },
  'grams': { base: 'g', factor: 1 },
  'kg': { base: 'g', factor: 1000 },
  'kilogram': { base: 'g', factor: 1000 },
  'kilograms': { base: 'g', factor: 1000 },
  'mg': { base: 'g', factor: 0.001 },
  'milligram': { base: 'g', factor: 0.001 },
  'milligrams': { base: 'g', factor: 0.001 },
  'oz': { base: 'g', factor: 28.35 },
  'ounce': { base: 'g', factor: 28.35 },
  'ounces': { base: 'g', factor: 28.35 },
  'lb': { base: 'g', factor: 453.592 },
  'pound': { base: 'g', factor: 453.592 },
  'pounds': { base: 'g', factor: 453.592 },

  // Count - base: unit
  'unit': { base: 'unit', factor: 1 },
  'units': { base: 'unit', factor: 1 },
  'piece': { base: 'unit', factor: 1 },
  'pieces': { base: 'unit', factor: 1 },
  'item': { base: 'unit', factor: 1 },
  'items': { base: 'unit', factor: 1 },
  '': { base: 'unit', factor: 1 }, // Empty string defaults to unit
};

/**
 * Normalize unit string for comparison
 */
function normalizeUnit(unit: string): string {
  return unit
    .toLowerCase()
    .trim()
    .replace(/\.$/, '') // Remove trailing period
    .replace(/s$/, ''); // Remove plural 's' for simple cases
}

/**
 * Convert quantity from one unit to another
 * Returns null if units are incompatible or unknown
 */
function convertQuantity(
  amount: number,
  fromUnit: string,
  toUnit: string
): number | null {
  const normalizedFrom = normalizeUnit(fromUnit);
  const normalizedTo = normalizeUnit(toUnit);

  // If units are the same, no conversion needed
  if (normalizedFrom === normalizedTo) {
    return amount;
  }

  // Look up conversion factors
  const fromConversion = UNIT_CONVERSIONS[normalizedFrom] || UNIT_CONVERSIONS[fromUnit.toLowerCase()];
  const toConversion = UNIT_CONVERSIONS[normalizedTo] || UNIT_CONVERSIONS[toUnit.toLowerCase()];

  // Check if both units are known
  if (!fromConversion || !toConversion) {
    logger.warn(`Unknown unit in conversion: ${fromUnit} or ${toUnit}`);
    return null;
  }

  // Check if units are compatible (same base unit)
  if (fromConversion.base !== toConversion.base) {
    logger.warn(`Incompatible units: ${fromUnit} (${fromConversion.base}) and ${toUnit} (${toConversion.base})`);
    return null;
  }

  // Convert: amount * fromFactor / toFactor
  const convertedAmount = (amount * fromConversion.factor) / toConversion.factor;
  return convertedAmount;
}

/**
 * Calculate quantity to deduct from inventory
 *
 * @param recipeQuantity - Amount required by recipe
 * @param recipeUnit - Unit of recipe ingredient
 * @param inventoryQuantity - Available quantity in inventory
 * @param inventoryUnit - Unit of inventory item
 * @param servings - Number of servings to cook (default: 1)
 * @param recipeServings - Original recipe servings (default: 1)
 * @returns Deduction details including amount and sufficiency
 */
export function calculateDeduction(
  recipeQuantity: number,
  recipeUnit: string,
  inventoryQuantity: number,
  inventoryUnit: string,
  servings: number = 1,
  recipeServings: number = 1
): QuantityDeduction {
  logger.info(
    `Calculating deduction: recipe=${recipeQuantity}${recipeUnit}, inventory=${inventoryQuantity}${inventoryUnit}, servings=${servings}/${recipeServings}`
  );

  // Calculate scaled quantity needed based on servings
  const scaleFactor = servings / recipeServings;
  const scaledRecipeQuantity = recipeQuantity * scaleFactor;

  logger.info(`Scaled recipe quantity: ${scaledRecipeQuantity}${recipeUnit} (scale factor: ${scaleFactor})`);

  // Try to convert recipe quantity to inventory unit
  const convertedQuantity = convertQuantity(scaledRecipeQuantity, recipeUnit, inventoryUnit);

  if (convertedQuantity === null) {
    // Units are incompatible or unknown
    // In this case, we can't reliably calculate, so we assume insufficient
    logger.warn(
      `Cannot convert units from ${recipeUnit} to ${inventoryUnit}. Treating as incompatible.`
    );
    return {
      deductAmount: 0,
      sufficient: false,
      remainingQuantity: inventoryQuantity,
    };
  }

  // Check if we have enough in inventory
  const sufficient = inventoryQuantity >= convertedQuantity;
  const deductAmount = sufficient ? convertedQuantity : inventoryQuantity;
  const remainingQuantity = Math.max(0, inventoryQuantity - deductAmount);

  // Round to 2 decimal places for cleaner numbers
  const roundedDeduct = Math.round(deductAmount * 100) / 100;
  const roundedRemaining = Math.round(remainingQuantity * 100) / 100;

  logger.info(
    `Deduction result: deduct=${roundedDeduct}${inventoryUnit}, sufficient=${sufficient}, remaining=${roundedRemaining}${inventoryUnit}`
  );

  return {
    deductAmount: roundedDeduct,
    sufficient,
    remainingQuantity: roundedRemaining,
  };
}

/**
 * Check if two units are compatible (can be converted)
 */
export function areUnitsCompatible(unit1: string, unit2: string): boolean {
  const normalized1 = normalizeUnit(unit1);
  const normalized2 = normalizeUnit(unit2);

  if (normalized1 === normalized2) {
    return true;
  }

  const conversion1 = UNIT_CONVERSIONS[normalized1] || UNIT_CONVERSIONS[unit1.toLowerCase()];
  const conversion2 = UNIT_CONVERSIONS[normalized2] || UNIT_CONVERSIONS[unit2.toLowerCase()];

  if (!conversion1 || !conversion2) {
    return false;
  }

  return conversion1.base === conversion2.base;
}
