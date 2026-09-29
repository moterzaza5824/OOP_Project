import { Ingredient, type IngredientType } from './Ingredient'

/**
 * วัตถุดิบที่วัดปริมาณด้วยปริมาตร เช่น มิลลิลิตร ลิตร หรือช้อน
 * แยกจากวัตถุดิบชนิดอื่นเพื่อให้แสดงประเภทและปรับปริมาณได้แบบ polymorphism
 */
export class VolumeIngredient extends Ingredient {
  // override เมธอดจากคลาสแม่เพื่อระบุว่าเป็นวัตถุดิบประเภทปริมาตร
  public override getType(): IngredientType {
    return 'volume'
  }

  // สร้างข้อความแสดงผลสำหรับหน่วยปริมาตร เช่น มิลลิลิตรหรือลิตร
  public override getDisplayText(): string {
    return `ปริมาตร: ${this.name} - ${this.quantity} ${this.unit}`
  }

  // คืน VolumeIngredient ตัวใหม่ตามสัดส่วน โดยไม่แก้ออบเจ็กต์เดิม
  public override withScaledQuantity(factor: number): VolumeIngredient {
    // ตรวจสอบตัวคูณด้วยเมธอดที่สืบทอดจาก Ingredient
    this.validateScaleFactor(factor)
    // สร้างออบเจ็กต์ชนิดเดิมพร้อมปริมาณใหม่
    return new VolumeIngredient(this.name, this.quantity * factor, this.unit)
  }
}
