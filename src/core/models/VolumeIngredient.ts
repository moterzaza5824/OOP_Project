import { Ingredient, type IngredientKind } from './Ingredient'

/** วัตถุดิบที่วัดเป็น "ปริมาตร" เช่น นม 500 มิลลิลิตร */
export class VolumeIngredient extends Ingredient {
  public static readonly UNITS = [
    'มิลลิลิตร',
    'ลิตร',
    'ช้อนชา',
    'ช้อนโต๊ะ',
    'ถ้วย',
  ] as const

  public static supportsUnit(unit: string): boolean {
    return (VolumeIngredient.UNITS as readonly string[]).includes(unit.trim())
  }

  constructor(name: string, quantity: number, unit: string) {
    super(name, quantity, unit)
    if (!VolumeIngredient.supportsUnit(this.unit)) {
      throw new Error(`Unit "${unit}" is not a volume unit.`)
    }
  }

  public getKind(): IngredientKind {
    return 'volume'
  }

  protected createCopy(quantity: number): VolumeIngredient {
    return new VolumeIngredient(this.name, quantity, this.unit)
  }

  /** 1500 มิลลิลิตร → 1.5 ลิตร, 0.5 ลิตร → 500 มิลลิลิตร */
  public override getFormattedQuantity(): string {
    if (this.unit === 'มิลลิลิตร' && this.quantity >= 1000) {
      return `${Ingredient.roundForDisplay(this.quantity / 1000)} ลิตร`
    }
    if (this.unit === 'ลิตร' && this.quantity < 1) {
      return `${Ingredient.roundForDisplay(this.quantity * 1000)} มิลลิลิตร`
    }
    return super.getFormattedQuantity()
  }
}
