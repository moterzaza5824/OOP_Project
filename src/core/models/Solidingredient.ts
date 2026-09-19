import { Ingredient } from "./Ingredient";

/**
 * SolidIngredient
 * ---------------
 * Inheritance: extends Ingredient, reuses all its encapsulated fields,
 * getters, and setQuantity().
 * Polymorphism: overrides getDisplayText() and withScaledQuantity() so
 * both keep returning the right label/subtype — no outside code needs to
 * know or check which subclass it's dealing with.
 */
export class SolidIngredient extends Ingredient {
  public override getDisplayText(): string {
    return `Solid: ${this.name} - ${this.quantity} ${this.unit}`;
  }

  public override withScaledQuantity(factor: number): SolidIngredient {
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new Error(`Scale factor must be greater than 0 (got: ${factor}).`);
    }
    return new SolidIngredient(this.name, this.quantity * factor, this.unit);
  }
}