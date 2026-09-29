import { Ingredient, type IngredientType } from './Ingredient'

/**
 * วัตถุดิบที่วัดปริมาณด้วยปริมาตร เช่น มิลลิลิตร ลิตร หรือช้อน
 * แยกจากวัตถุดิบชนิดอื่นเพื่อให้แสดงประเภทและปรับปริมาณได้แบบ polymorphism
 */
export class VolumeIngredient extends Ingredient {
  public override getType(): IngredientType {
    return 'volume'
  }

  public override getDisplayText(): string {
    return `ปริมาตร: ${this.name} - ${this.quantity} ${this.unit}`
  }

  public override withScaledQuantity(factor: number): VolumeIngredient {
    this.validateScaleFactor(factor)
    return new VolumeIngredient(this.name, this.quantity * factor, this.unit)
  }
}
