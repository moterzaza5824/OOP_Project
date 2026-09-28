export type IngredientKind = 'weight' | 'volume' | 'count'

/**
 * Ingredient (abstract base class)
 * --------------------------------
 * - Abstraction: ห้าม `new Ingredient()` ตรง ๆ — ต้องเป็น Weighted/Volume/Count เท่านั้น
 * - Encapsulation: field เป็น `protected` เข้าถึงผ่าน getter / setQuantity() (มี validation)
 * - Inheritance: subclass ใช้ field + getter + setter + withScaledQuantity() ร่วมกัน
 *   และเติมเฉพาะสิ่งที่ต่างกันจริงตามชนิดการวัด (หน่วยที่รองรับ, วิธีแสดงผล)
 * - Polymorphism: getKind(), getFormattedQuantity() และ createCopy() ถูก override —
 *   ผู้เรียกถือตัวแปรชนิด Ingredient แล้วเรียก method เดียวกัน
 */
export abstract class Ingredient {
  protected name: string
  protected quantity: number
  protected unit: string

  constructor(name: string, quantity: number, unit: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Ingredient name must not be empty.')
    }
    Ingredient.assertPositive(quantity, 'Ingredient quantity')
    if (!unit || unit.trim().length === 0) {
      throw new Error('Ingredient unit must not be empty.')
    }
    this.name = name.trim()
    this.quantity = quantity
    this.unit = unit.trim()
  }

  private static assertPositive(value: number, label: string): void {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`${label} must be greater than 0 (got: ${value}).`)
    }
  }

  public getName(): string {
    return this.name
  }

  public getQuantity(): number {
    return this.quantity
  }

  public getUnit(): string {
    return this.unit
  }

  public setQuantity(quantity: number): void {
    Ingredient.assertPositive(quantity, 'Quantity')
    this.quantity = quantity
  }

  /** ชนิดการวัด ใช้ตอนบันทึก/โหลดแทน instanceof */
  public abstract getKind(): IngredientKind

  /** Template method: subclass บอกว่าจะสร้างสำเนาชนิดตัวเองอย่างไร */
  protected abstract createCopy(quantity: number): Ingredient

  /** ปริมาณ+หน่วยที่จัดรูปแล้ว (ตัดทศนิยมยาว ๆ) — GUI ควรใช้ตัวนี้แทน getQuantity() */
  public getFormattedQuantity(): string {
    return `${Ingredient.roundForDisplay(this.quantity)} ${this.unit}`
  }

  public getDisplayText(): string {
    return `${this.name} - ${this.getFormattedQuantity()}`
  }

  public clone(): Ingredient {
    return this.createCopy(this.quantity)
  }

  public withScaledQuantity(factor: number): Ingredient {
    Ingredient.assertPositive(factor, 'Scale factor')
    return this.createCopy(this.quantity * factor)
  }

  protected static roundForDisplay(value: number, digits = 2): number {
    const p = 10 ** digits
    return Math.round((value + Number.EPSILON) * p) / p
  }
}
