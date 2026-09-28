import { Ingredient, type IngredientType } from './Ingredient'

export class CountIngredient extends Ingredient {
  public override getType(): IngredientType {
    return 'count'
  }

  public override getDisplayText(): string {
    return `จำนวน: ${this.name} - ${this.quantity} ${this.unit}`
  }

  public override withScaledQuantity(factor: number): CountIngredient {
    this.validateScaleFactor(factor)
    // Fractional counts are valid after scaling, for example 1.5 eggs.
    return new CountIngredient(this.name, this.quantity * factor, this.unit)
  }
}
