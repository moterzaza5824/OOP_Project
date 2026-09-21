import { Ingredient } from "./Ingredient";

/**
 * LiquidIngredient
 * ----------------
 * Same Inheritance/Polymorphism role as SolidIngredient — see that file's
 * comment for the reasoning. This class only differs in its display label.
 */
export class LiquidIngredient extends Ingredient {
  public override getDisplayText(): string {
    return `Liquid: ${this.name} - ${this.quantity} ${this.unit}`;
  }

  public override withScaledQuantity(factor: number): LiquidIngredient {
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new Error(`Scale factor must be greater than 0 (got: ${factor}).`);
    }
    return new LiquidIngredient(this.name, this.quantity * factor, this.unit);
  }
}