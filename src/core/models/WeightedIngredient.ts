import { Ingredient, type IngredientType } from './Ingredient'

/**
 * วัตถุดิบที่วัดปริมาณด้วยน้ำหนัก เช่น กรัมหรือกิโลกรัม
 * สืบทอดการตรวจสอบข้อมูลจาก Ingredient และคืนออบเจ็กต์ชนิดเดิมเมื่อปรับสัดส่วน
 */
export class WeightedIngredient extends Ingredient {
  // override เมธอดจากคลาสแม่เพื่อระบุว่าเป็นวัตถุดิบประเภทน้ำหนัก
  public override getType(): IngredientType {
    return 'weighted'
  }

  // สร้างข้อความแสดงผลโดยใช้ข้อมูล protected ที่สืบทอดจาก Ingredient
  public override getDisplayText(): string {
    return `น้ำหนัก: ${this.name} - ${this.quantity} ${this.unit}`
  }

  // คืน WeightedIngredient ตัวใหม่ ทำให้สูตรต้นฉบับไม่ถูกแก้ไข
  public override withScaledQuantity(factor: number): WeightedIngredient {
    // ใช้ validation ส่วนกลางที่สืบทอดจากคลาสแม่
    this.validateScaleFactor(factor)
    // คูณปริมาณเดิมด้วย factor และคงชื่อกับหน่วยเดิมไว้
    return new WeightedIngredient(this.name, this.quantity * factor, this.unit)
  }
}
