import { Recipe } from "../models/Recipe";
import { RecipeBuilder } from "../builders/RecipeBuilder";

/**
 * Service สำหรับสร้างสูตรใหม่ตามจำนวนเสิร์ฟที่ต้องการ โดยไม่แก้ไขสูตรต้นฉบับ
 *
 * ใช้สัดส่วน `จำนวนเสิร์ฟใหม่ / จำนวนเสิร์ฟเดิม` คูณปริมาณวัตถุดิบทุกตัว แล้วใช้
 * RecipeBuilder ประกอบผลลัพธ์อีกครั้ง การเรียก withScaledQuantity() ผ่านคลาสแม่
 * ทำให้วัตถุดิบแต่ละชนิดปรับปริมาณด้วย implementation ของตัวเอง (polymorphism)
 */
export class RecipeScaler {
  public static scale(recipe: Recipe, targetServings: number): Recipe {
    if (!Number.isFinite(targetServings) || targetServings <= 0) {
      throw new Error(
        `Target servings must be greater than 0 (got: ${targetServings}).`
      );
    }

    const ingredients = recipe.getIngredients();
    if (ingredients.length === 0) {
      throw new Error("Cannot scale: recipe has no ingredients.");
    }

    const scaleFactor = targetServings / recipe.getServings();

    const builder = new RecipeBuilder()
      .setId(recipe.getId())
      .setName(recipe.getName())
      .setServings(targetServings);

    for (const ingredient of ingredients) {
      builder.addIngredient(ingredient.withScaledQuantity(scaleFactor));
    }

    return builder.build();
  }
}
