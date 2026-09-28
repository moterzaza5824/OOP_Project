import { Recipe } from '../models/Recipe'
import type { Ingredient } from '../models/Ingredient'

/**
 * RecipeBuilder — Builder Pattern
 *
 *   new RecipeBuilder()
 *     .setName('ผัดกะเพรา')
 *     .setServings(2)
 *     .addIngredient(new WeightedIngredient('หมูสับ', 200, 'กรัม'))
 *     .addIngredient(new CountIngredient('ไข่', 2, 'ฟอง'))
 *     .build()
 *
 * ใช้ตอน: สร้างสูตรใหม่, แก้ไขสูตร (RecipeBuilder.from), โหลดจาก storage, และ RecipeScaler
 */
export class RecipeBuilder {
  private id: string | undefined
  private createdAt: number | undefined
  private name: string | null = null
  private servings: number | null = null
  private ingredients: Ingredient[] = []

  /** เริ่มจากสูตรเดิม (ใช้ตอนแก้ไข — คง id / createdAt เดิมไว้) */
  public static from(recipe: Recipe): RecipeBuilder {
    const builder = new RecipeBuilder()
      .setId(recipe.getId())
      .setCreatedAt(recipe.getCreatedAt())
      .setName(recipe.getName())
      .setServings(recipe.getServings())
    for (const ingredient of recipe.getIngredients()) {
      builder.addIngredient(ingredient)
    }
    return builder
  }

  public setId(id: string): this {
    if (!id) throw new Error('Recipe id must not be empty.')
    this.id = id
    return this
  }

  public setCreatedAt(createdAt: number): this {
    if (!Number.isFinite(createdAt)) throw new Error('Invalid createdAt.')
    this.createdAt = createdAt
    return this
  }

  public setName(name: string): this {
    if (!name || name.trim().length === 0) {
      throw new Error('Recipe name must not be empty.')
    }
    this.name = name.trim()
    return this
  }

  public setServings(servings: number): this {
    if (!Number.isFinite(servings) || servings <= 0) {
      throw new Error(`Servings must be greater than 0 (got: ${servings}).`)
    }
    this.servings = servings
    return this
  }

  /** รับ Ingredient ชนิดไหนก็ได้ (Polymorphism) */
  public addIngredient(ingredient: Ingredient): this {
    if (!ingredient) throw new Error('Ingredient must not be null.')
    this.ingredients.push(ingredient)
    return this
  }

  public build(): Recipe {
    if (this.name === null) {
      throw new Error('Cannot build Recipe: call setName() before build().')
    }
    if (this.servings === null) {
      throw new Error('Cannot build Recipe: call setServings() before build().')
    }
    if (this.ingredients.length === 0) {
      throw new Error('Cannot build Recipe: add at least one ingredient before build().')
    }
    return new Recipe(
      this.name,
      this.servings,
      this.ingredients,
      this.id,
      this.createdAt,
    )
  }
}
