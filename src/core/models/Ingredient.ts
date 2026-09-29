// กำหนดชนิดวัตถุดิบที่ระบบรองรับ เพื่อให้ TypeScript ป้องกันค่าประเภทที่ไม่ถูกต้อง
export type IngredientType = 'weighted' | 'volume' | 'count'

/**
 * คลาสแม่แบบนามธรรมของวัตถุดิบทุกชนิด
 *
 * เก็บข้อมูลพื้นฐานที่วัตถุดิบทุกประเภทใช้ร่วมกัน ได้แก่ ชื่อ ปริมาณ และหน่วย
 * พร้อมตรวจสอบความถูกต้องของข้อมูลจากจุดเดียว ส่วนคลาสลูกมีหน้าที่กำหนดชนิด
 * รูปแบบข้อความที่แสดง และวิธีสร้างวัตถุดิบใหม่เมื่อปรับสัดส่วน
 */
export abstract class Ingredient {
  // protected ทำให้คลาสลูกเข้าถึงข้อมูลได้ แต่โค้ดภายนอกคลาสแก้ไขโดยตรงไม่ได้
  protected name: string;
  protected quantity: number;
  protected unit: string;

  constructor(name: string, quantity: number, unit: string) {
    // ตรวจสอบว่าชื่อไม่เป็นค่าว่างก่อนเก็บลงในออบเจ็กต์
    if (!name || name.trim().length === 0) {
      throw new Error("Ingredient name must not be empty.");
    }
    // ปริมาณต้องเป็นตัวเลขที่ใช้งานได้และมากกว่าศูนย์
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(
        `Ingredient quantity must be greater than 0 (got: ${quantity}).`
      );
    }
    // หน่วยต้องไม่เป็นค่าว่าง เพราะใช้จำแนกประเภทและแสดงผลวัตถุดิบ
    if (!unit || unit.trim().length === 0) {
      throw new Error("Ingredient unit must not be empty.");
    }
    // trim() ตัดช่องว่างส่วนเกินก่อนเก็บข้อมูลจริงภายในคลาส
    this.name = name.trim();
    this.quantity = quantity;
    this.unit = unit.trim();
  }

  public getName(): string {
    // คืนชื่อผ่าน getter แทนการเปิด field ให้เข้าถึงโดยตรง
    return this.name;
  }

  public getQuantity(): number {
    // คืนค่าปริมาณปัจจุบันของวัตถุดิบ
    return this.quantity;
  }

  public getUnit(): string {
    // คืนหน่วยวัด เช่น กรัม มิลลิลิตร หรือฟอง
    return this.unit;
  }

  /** Validated setter — mutates this Ingredient's quantity directly. */
  public setQuantity(quantity: number): void {
    // ตรวจสอบค่าใหม่ด้วยกฎเดียวกับตอนสร้างออบเจ็กต์
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Quantity must be greater than 0 (got: ${quantity}).`);
    }
    // เปลี่ยนค่าได้เมื่อผ่าน validation แล้วเท่านั้น
    this.quantity = quantity;
  }

  protected validateScaleFactor(factor: number): void {
    // ตัวคูณต้องมากกว่าศูนย์ เพื่อไม่ให้ได้ปริมาณติดลบ ศูนย์ หรือ NaN
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new Error(`Scale factor must be greater than 0 (got: ${factor}).`);
    }
  }

  // คลาสลูกต้องระบุประเภทของตัวเอง เช่น weighted, volume หรือ count
  public abstract getType(): IngredientType

  // คลาสลูกต้องกำหนดรูปแบบข้อความที่เหมาะกับวัตถุดิบประเภทนั้น
  public abstract getDisplayText(): string

  /** Returns the same runtime subtype with a scaled quantity. */
  // คลาสลูกต้องสร้างออบเจ็กต์ชนิดเดิมที่มีปริมาณคูณด้วย factor
  public abstract withScaledQuantity(factor: number): Ingredient
}
