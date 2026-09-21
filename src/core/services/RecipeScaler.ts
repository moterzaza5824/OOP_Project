import { Recipe } from "../models/Recipe";
import { RecipeBuilder } from "../builders/RecipeBuilder";

/**
 * RecipeScaler
 * ------------
 * Single Responsibility: turn an existing Recipe into a new Recipe scaled
 * to a target number of servings. Does not mutate the Recipe passed in.
 *
 * Formula:
 *     scaleFactor  = targetServings / originalServings
 *     newQuantity  = originalQuantity × scaleFactor
 *
 * Reuses RecipeBuilder to assemble the result (composition) instead of
 * calling `new Recipe(...)` directly, so the scaled Recipe goes through
 * the exact same construction/validation path as any hand-built Recipe.
 *
 * Notice this method never checks `instanceof SolidIngredient` or
 * `instanceof LiquidIngredient` — it just calls `ingredient
 * .withScaledQuantity(factor)` and lets polymorphism pick the right
 * override, so the returned ingredient is always the correct subtype.
 */
export class RecipeScaler {
  public static scale(recipe: Recipe, targetServings: number): Recipe {
    if (!Number.isFinite(targetServings) || targetServings <= 0) {
      throw new Error(
        `Target servings must be greater than 0 (got: ${targetServings}).`
      );
    }

    const ingredients = recipe.getIngredients();
    if (ingredients.length === 0) {
      throw new Error("Cannot scale: recipe has no ingredients.");
    }

    const scaleFactor = targetServings / recipe.getServings();

    const builder = new RecipeBuilder()
      .setName(recipe.getName())
      .setServings(targetServings);

    for (const ingredient of ingredients) {
      builder.addIngredient(ingredient.withScaledQuantity(scaleFactor));
    }

    return builder.build();
  }
}