export type IngredientType = 'weighted' | 'volume' | 'count'

/**
 * คลาสแม่แบบนามธรรมของวัตถุดิบทุกชนิด
 *
 * เก็บข้อมูลพื้นฐานที่วัตถุดิบทุกประเภทใช้ร่วมกัน ได้แก่ ชื่อ ปริมาณ และหน่วย
 * พร้อมตรวจสอบความถูกต้องของข้อมูลจากจุดเดียว ส่วนคลาสลูกมีหน้าที่กำหนดชนิด
 * รูปแบบข้อความที่แสดง และวิธีสร้างวัตถุดิบใหม่เมื่อปรับสัดส่วน
 */
export abstract class Ingredient {
  protected name: string;
  protected quantity: number;
  protected unit: string;

  constructor(name: string, quantity: number, unit: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("Ingredient name must not be empty.");
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(
        `Ingredient quantity must be greater than 0 (got: ${quantity}).`
      );
    }
    if (!unit || unit.trim().length === 0) {
      throw new Error("Ingredient unit must not be empty.");
    }
    this.name = name.trim();
    this.quantity = quantity;
    this.unit = unit.trim();
  }

  public getName(): string {
    return this.name;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnit(): string {
    return this.unit;
  }

  /** Validated setter — mutates this Ingredient's quantity directly. */
  public setQuantity(quantity: number): void {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Quantity must be greater than 0 (got: ${quantity}).`);
    }
    this.quantity = quantity;
  }

  protected validateScaleFactor(factor: number): void {
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new Error(`Scale factor must be greater than 0 (got: ${factor}).`);
    }
  }

  public abstract getType(): IngredientType

  public abstract getDisplayText(): string

  /** Returns the same runtime subtype with a scaled quantity. */
  public abstract withScaledQuantity(factor: number): Ingredient
}
