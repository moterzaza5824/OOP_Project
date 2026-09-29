import { Ingredient, type IngredientType } from './Ingredient'

/**
 * วัตถุดิบที่วัดเป็นจำนวนชิ้น เช่น ฟอง ลูก หรือตัว
 * ค่าหลังปรับสัดส่วนอาจเป็นทศนิยมได้ เช่น ไข่ 1.5 ฟอง
 */
export class CountIngredient extends Ingredient {
  // override เมธอดจากคลาสแม่เพื่อระบุว่าเป็นวัตถุดิบประเภทนับจำนวน
  public override getType(): IngredientType {
    return 'count'
  }

  // สร้างข้อความแสดงผลสำหรับหน่วยนับ เช่น ชิ้น ฟอง ลูก หรือตัว
  public override getDisplayText(): string {
    return `จำนวน: ${this.name} - ${this.quantity} ${this.unit}`
  }

  // คืน CountIngredient ตัวใหม่ โดยผลลัพธ์สามารถเป็นทศนิยมหลังปรับสูตรได้
  public override withScaledQuantity(factor: number): CountIngredient {
    // ตรวจสอบว่าตัวคูณถูกต้องก่อนคำนวณ
    this.validateScaleFactor(factor)
    // Fractional counts are valid after scaling, for example 1.5 eggs.
    // คูณปริมาณเดิมและรักษา runtime subtype ให้ยังเป็น CountIngredient
    return new CountIngredient(this.name, this.quantity * factor, this.unit)
  }
}
