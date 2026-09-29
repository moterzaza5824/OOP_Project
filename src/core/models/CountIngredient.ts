import { Ingredient, type IngredientType } from './Ingredient'

/**
 * วัตถุดิบที่วัดเป็นจำนวนชิ้น เช่น ฟอง ลูก หรือตัว
 * ค่าหลังปรับสัดส่วนอาจเป็นทศนิยมได้ เช่น ไข่ 1.5 ฟอง
 */
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
