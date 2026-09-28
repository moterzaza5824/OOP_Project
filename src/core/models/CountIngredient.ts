import { Ingredient, type IngredientKind } from './Ingredient'

/** วัตถุดิบที่วัดเป็น "จำนวนนับ" เช่น ไข่ 3 ฟอง */
export class CountIngredient extends Ingredient {
  public static readonly UNITS = ['ชิ้น', 'ฟอง', 'ลูก'] as const

  public static supportsUnit(unit: string): boolean {
    return (CountIngredient.UNITS as readonly string[]).includes(unit.trim())
  }

  constructor(name: string, quantity: number, unit: string) {
    super(name, quantity, unit)
    if (!CountIngredient.supportsUnit(this.unit)) {
      throw new Error(`Unit "${unit}" is not a count unit.`)
    }
  }

  public getKind(): IngredientKind {
    return 'count'
  }

  protected createCopy(quantity: number): CountIngredient {
    return new CountIngredient(this.name, quantity, this.unit)
  }

  /** ของนับได้: 7.5 ฟอง → "7.5 ฟอง (ประมาณ 8 ฟอง)" */
  public override getFormattedQuantity(): string {
    const rounded = Ingredient.roundForDisplay(this.quantity)
    if (Number.isInteger(rounded)) {
      return `${rounded} ${this.unit}`
    }
    return `${rounded} ${this.unit} (ประมาณ ${Math.round(this.quantity)} ${this.unit})`
  }
}
