import { Ingredient } from './Ingredient'

/**
 * Recipe
 * ------
 * สร้างผ่าน RecipeBuilder.build() เป็นหลัก แต่ constructor ตรวจข้อมูลซ้ำเอง
 * (defensive) เพราะ TypeScript ไม่มี package-private — จึงไม่ปล่อยให้ Recipe
 * ที่ไม่ถูกต้องเกิดขึ้นได้แม้มีคนเรียก `new Recipe()` ตรง ๆ
 *
 * เพิ่ม id / createdAt เพื่อให้ RecipeManager อ้างอิงสูตรด้วย id
 * แทนการเทียบ object reference และใช้เรียง "ล่าสุด" ได้ตรงไปตรงมา
 */
export class Recipe {
  private readonly id: string
  private readonly createdAt: number
  private readonly name: string
  private readonly servings: number
  private readonly ingredients: Ingredient[]

  constructor(
    name: string,
    servings: number,
    ingredients: Ingredient[],
    id: string = crypto.randomUUID(),
    createdAt: number = Date.now(),
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Recipe name must not be empty.')
    }
    if (!Number.isFinite(servings) || servings <= 0) {
      throw new Error(`Servings must be greater than 0 (got: ${servings}).`)
    }
    if (ingredients.length === 0) {
      throw new Error('Recipe must have at least one ingredient.')
    }
    this.id = id
    this.createdAt = createdAt
    this.name = name.trim()
    this.servings = servings
    this.ingredients = ingredients.map((i) => i.clone())
  }

  public getId(): string {
    return this.id
  }

  public getCreatedAt(): number {
    return this.createdAt
  }

  public getName(): string {
    return this.name
  }

  public getServings(): number {
    return this.servings
  }

  /** คืนสำเนา เพื่อไม่ให้ภายนอกแก้ข้อมูลภายใน Recipe ผ่าน setQuantity() */
  public getIngredients(): Ingredient[] {
    return this.ingredients.map((i) => i.clone())
  }

  public describe(): string {
    return [
      this.name,
      `Servings: ${this.servings}`,
      ...this.ingredients.map((i) => `  ${i.getDisplayText()}`),
    ].join('\n')
  }
}
