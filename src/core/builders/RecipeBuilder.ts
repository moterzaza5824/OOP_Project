import { Recipe } from "../models/Recipe";
import { Ingredient } from "../models/Ingredient";

/**
 * RecipeBuilder
 * -------------
 * THE Builder Pattern class for this project.
 *
 * Why a Builder instead of `new Recipe(name, servings, ingredients)`
 * directly? A Recipe has a variable-length list of ingredients added one
 * at a time from a form. The Builder lets us construct step by step
 * (setName → setServings → addIngredient → ... → build), validating each
 * piece as it arrives, and only producing a Recipe once everything is
 * confirmed valid. Each method returns `this` for fluent chaining:
 *
 *   new RecipeBuilder()
 *     .setName("Pancake")
 *     .setServings(2)
 *     .addIngredient(IngredientFactory.create("Flour", 200, "กรัม"))
 *     .addIngredient(IngredientFactory.create("Milk", 300, "มิลลิลิตร"))
 *     .build();
 */
export class RecipeBuilder {
  private id: string | null = null;
  private name: string | null = null;
  private servings: number | null = null;
  private ingredients: Ingredient[] = [];

  public setId(id: string): this {
    if (!id || id.trim().length === 0) {
      throw new Error('Recipe id must not be empty.');
    }
    this.id = id.trim();
    return this;
  }

  public setName(name: string): this {
    if (!name || name.trim().length === 0) {
      throw new Error("Recipe name must not be empty.");
    }
    this.name = name.trim();
    return this;
  }

  public setServings(servings: number): this {
    if (!Number.isFinite(servings) || servings <= 0) {
      throw new Error(`Servings must be greater than 0 (got: ${servings}).`);
    }
    this.servings = servings;
    return this;
  }

  /**
   * Accepts any Ingredient subtype. Polymorphism means this method doesn't
   * need to know whether it is measured by weight, volume, or count.
   * Each Ingredient already validated itself in its own constructor.
   */
  public addIngredient(ingredient: Ingredient): this {
    this.ingredients.push(ingredient);
    return this;
  }

  public build(): Recipe {
    if (this.name === null) {
      throw new Error("Cannot build Recipe: call setName() before build().");
    }
    if (this.servings === null) {
      throw new Error(
        "Cannot build Recipe: call setServings() before build()."
      );
    }
    if (this.ingredients.length === 0) {
      throw new Error(
        "Cannot build Recipe: add at least one ingredient before build()."
      );
    }
    return new Recipe(
      this.id ?? crypto.randomUUID(),
      this.name,
      this.servings,
      this.ingredients,
    );
  }
}
