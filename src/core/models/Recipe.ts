import { Ingredient } from "./Ingredient";

/**
 * เอนทิตีที่แทนสูตรอาหารหนึ่งสูตร
 *
 * เก็บรหัส ชื่อ จำนวนเสิร์ฟ และรายการวัตถุดิบไว้ภายใน โดยทำสำเนาวัตถุดิบทั้งตอน
 * รับเข้าและส่งออก เพื่อป้องกันโค้ดภายนอกแก้ไขสถานะภายในของสูตรโดยไม่ตั้งใจ
 * ปกติควรสร้างผ่าน RecipeBuilder เพื่อให้ข้อมูลผ่านการตรวจสอบครบถ้วนก่อนใช้งาน
 */
export class Recipe {
  // private เป็น Encapsulation: ภายนอกต้องอ่านข้อมูลผ่าน getter เท่านั้น
  private id: string;
  private name: string;
  private servings: number;
  private ingredients: Ingredient[];

  constructor(
    id: string,
    name: string,
    servings: number,
    ingredients: Ingredient[],
  ) {
    // เก็บค่าที่ผ่านการตรวจสอบจาก RecipeBuilder ลงในสถานะภายใน
    this.id = id;
    this.name = name;
    this.servings = servings;
    // สร้างสำเนาของ Ingredient ทุกตัว ป้องกันผู้เรียกเก็บ reference แล้วแก้ข้อมูลภายใน
    this.ingredients = ingredients.map((ingredient) =>
      ingredient.withScaledQuantity(1)
    );
  }

  public getId(): string {
    // คืนรหัสที่ใช้ค้นหา แก้ไข และลบสูตร
    return this.id;
  }

  public getName(): string {
    // คืนชื่อสูตรอาหาร
    return this.name;
  }

  public getServings(): number {
    // คืนจำนวนเสิร์ฟต้นฉบับของสูตร
    return this.servings;
  }

  /**
   * Returns copies of both the array and its Ingredient objects so outside
   * code cannot mutate the Recipe's internal data through setQuantity().
   */
  public getIngredients(): Ingredient[] {
    // คืนทั้งอาร์เรย์ใหม่และออบเจ็กต์ Ingredient ใหม่ เพื่อรักษา Encapsulation
    return this.ingredients.map((ingredient) =>
      ingredient.withScaledQuantity(1)
    );
  }

  /** Human-readable summary; uses each ingredient's own getDisplayText()
   *  (polymorphic — Solid/Liquid ingredients print their own label). */
  public describe(): string {
    // สร้างบรรทัดแรกจากชื่อสูตรและจำนวนเสิร์ฟ
    const lines = [
      this.name,
      `Servings: ${this.servings}`,
      // Polymorphism: Ingredient แต่ละ subtype เลือก getDisplayText() ของตัวเอง
      ...this.ingredients.map((i) => `  ${i.getDisplayText()}`),
    ];
    // รวมอาร์เรย์ข้อความเป็นข้อความหลายบรรทัดหนึ่งชุด
    return lines.join("\n");
  }
}
