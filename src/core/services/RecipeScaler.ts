import type { Recipe } from '../models/Recipe'
import { RecipeBuilder } from '../builders/RecipeBuilder'

/**
 * RecipeScaler — ปรับสูตรเป็นจำนวนเสิร์ฟใหม่ โดยไม่แก้ Recipe เดิม
 *
 *   scaleFactor = targetServings / originalServings
 *   newQuantity = originalQuantity × scaleFactor
 *
 * ไม่มี instanceof: เรียก ingredient.withScaledQuantity(factor) แล้ว
 * Polymorphism คืน subclass ที่ถูกต้อง (Weighted/Volume/Count) ให้เอง
 * ผลลัพธ์เป็น Recipe ใหม่ (id ใหม่) — เป็นแค่ผลคำนวณ ไม่ได้ถูกเก็บเข้า Manager
 */
export class RecipeScaler {
  public static scale(recipe: Recipe, targetServings: number): Recipe {
    if (!Number.isFinite(targetServings) || targetServings <= 0) {
      throw new Error(`Target servings must be greater than 0 (got: ${targetServings}).`)
    }

    const scaleFactor = targetServings / recipe.getServings()
    const builder = new RecipeBuilder()
      .setName(recipe.getName())
      .setServings(targetServings)

    for (const ingredient of recipe.getIngredients()) {
      builder.addIngredient(ingredient.withScaledQuantity(scaleFactor))
    }
    return builder.build()
  }
}
