import { Ingredient, type IngredientType } from './Ingredient'

export class WeightedIngredient extends Ingredient {
  public override getType(): IngredientType {
    return 'weighted'
  }

  public override getDisplayText(): string {
    return `น้ำหนัก: ${this.name} - ${this.quantity} ${this.unit}`
  }

  public override withScaledQuantity(factor: number): WeightedIngredient {
    this.validateScaleFactor(factor)
    return new WeightedIngredient(this.name, this.quantity * factor, this.unit)
  }
}
