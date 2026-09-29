import { Ingredient } from "./Ingredient";

/**
 * เอนทิตีที่แทนสูตรอาหารหนึ่งสูตร
 *
 * เก็บรหัส ชื่อ จำนวนเสิร์ฟ และรายการวัตถุดิบไว้ภายใน โดยทำสำเนาวัตถุดิบทั้งตอน
 * รับเข้าและส่งออก เพื่อป้องกันโค้ดภายนอกแก้ไขสถานะภายในของสูตรโดยไม่ตั้งใจ
 * ปกติควรสร้างผ่าน RecipeBuilder เพื่อให้ข้อมูลผ่านการตรวจสอบครบถ้วนก่อนใช้งาน
 */
export class Recipe {
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
    this.id = id;
    this.name = name;
    this.servings = servings;
    this.ingredients = ingredients.map((ingredient) =>
      ingredient.withScaledQuantity(1)
    );
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getServings(): number {
    return this.servings;
  }

  /**
   * Returns copies of both the array and its Ingredient objects so outside
   * code cannot mutate the Recipe's internal data through setQuantity().
   */
  public getIngredients(): Ingredient[] {
    return this.ingredients.map((ingredient) =>
      ingredient.withScaledQuantity(1)
    );
  }

  /** Human-readable summary; uses each ingredient's own getDisplayText()
   *  (polymorphic — Solid/Liquid ingredients print their own label). */
  public describe(): string {
    const lines = [
      this.name,
      `Servings: ${this.servings}`,
      ...this.ingredients.map((i) => `  ${i.getDisplayText()}`),
    ];
    return lines.join("\n");
  }
}
