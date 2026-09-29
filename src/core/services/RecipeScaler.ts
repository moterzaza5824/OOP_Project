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
    // จำนวนเสิร์ฟเป้าหมายต้องเป็นตัวเลขที่มากกว่าศูนย์
    if (!Number.isFinite(targetServings) || targetServings <= 0) {
      throw new Error(
        `Target servings must be greater than 0 (got: ${targetServings}).`
      );
    }

    // รับสำเนาวัตถุดิบจาก Recipe เพื่อไม่แก้ไขสูตรต้นฉบับ
    const ingredients = recipe.getIngredients();
    // ป้องกันการคำนวณสูตรที่ไม่มีวัตถุดิบ
    if (ingredients.length === 0) {
      throw new Error("Cannot scale: recipe has no ingredients.");
    }

    // ตัวคูณเท่ากับจำนวนเสิร์ฟใหม่หารด้วยจำนวนเสิร์ฟเดิม
    const scaleFactor = targetServings / recipe.getServings();

    // สร้าง Builder และคง id/ชื่อเดิม แต่เปลี่ยนจำนวนเสิร์ฟเป็นค่าเป้าหมาย
    const builder = new RecipeBuilder()
      .setId(recipe.getId())
      .setName(recipe.getName())
      .setServings(targetServings);

    // วนผ่าน Ingredient ทุก subtype โดยไม่ต้องตรวจชนิดจริงของออบเจ็กต์
    for (const ingredient of ingredients) {
      // Polymorphism จะเลือก withScaledQuantity() ของ subclass ที่ถูกต้องเอง
      builder.addIngredient(ingredient.withScaledQuantity(scaleFactor));
    }

    // สร้าง Recipe ใหม่ จึงไม่เปลี่ยนแปลง Recipe ต้นฉบับ
    return builder.build();
  }
}
