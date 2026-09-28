import { Ingredient, type IngredientKind } from './Ingredient'

/** วัตถุดิบที่วัดเป็น "น้ำหนัก" เช่น หมู 500 กรัม */
export class WeightedIngredient extends Ingredient {
  public static readonly UNITS = ['กรัม', 'กิโลกรัม'] as const

  public static supportsUnit(unit: string): boolean {
    return (WeightedIngredient.UNITS as readonly string[]).includes(unit.trim())
  }

  constructor(name: string, quantity: number, unit: string) {
    super(name, quantity, unit)
    if (!WeightedIngredient.supportsUnit(this.unit)) {
      throw new Error(`Unit "${unit}" is not a weight unit.`)
    }
  }

  public getKind(): IngredientKind {
    return 'weight'
  }

  protected createCopy(quantity: number): WeightedIngredient {
    return new WeightedIngredient(this.name, quantity, this.unit)
  }

  /** 1500 กรัม → 1.5 กิโลกรัม, 0.5 กิโลกรัม → 500 กรัม */
  public override getFormattedQuantity(): string {
    if (this.unit === 'กรัม' && this.quantity >= 1000) {
      return `${Ingredient.roundForDisplay(this.quantity / 1000)} กิโลกรัม`
    }
    if (this.unit === 'กิโลกรัม' && this.quantity < 1) {
      return `${Ingredient.roundForDisplay(this.quantity * 1000)} กรัม`
    }
    return super.getFormattedQuantity()
  }
}
