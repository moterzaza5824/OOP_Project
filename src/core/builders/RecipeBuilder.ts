import { Recipe } from "../models/Recipe";
import { Ingredient } from "../models/Ingredient";

/**
 * Builder สำหรับประกอบ Recipe ทีละส่วน
 *
 * เหมาะกับข้อมูลจากฟอร์มซึ่งเพิ่มวัตถุดิบได้หลายรายการ โดยแต่ละเมธอดตรวจสอบค่า
 * และคืน `this` เพื่อให้เรียกต่อกันแบบ fluent interface ได้ ส่วน build() จะสร้าง
 * Recipe ก็ต่อเมื่อมีชื่อ จำนวนเสิร์ฟ และวัตถุดิบอย่างน้อยหนึ่งรายการครบแล้ว
 */
export class RecipeBuilder {
  private id: string | null = null;
  private name: string | null = null;
  private servings: number | null = null;
  private ingredients: Ingredient[] = [];

  public setId(id: string): this {
    if (!id || id.trim().length === 0) {
      throw new Error('Recipe id must not be empty.');
    }
    this.id = id.trim();
    return this;
  }

  public setName(name: string): this {
    if (!name || name.trim().length === 0) {
      throw new Error("Recipe name must not be empty.");
    }
    this.name = name.trim();
    return this;
  }

  public setServings(servings: number): this {
    if (!Number.isFinite(servings) || servings <= 0) {
      throw new Error(`Servings must be greater than 0 (got: ${servings}).`);
    }
    this.servings = servings;
    return this;
  }

  /**
   * Accepts any Ingredient subtype. Polymorphism means this method doesn't
   * need to know whether it is measured by weight, volume, or count.
   * Each Ingredient already validated itself in its own constructor.
   */
  public addIngredient(ingredient: Ingredient): this {
    this.ingredients.push(ingredient);
    return this;
  }

  public build(): Recipe {
    if (this.name === null) {
      throw new Error("Cannot build Recipe: call setName() before build().");
    }
    if (this.servings === null) {
      throw new Error(
        "Cannot build Recipe: call setServings() before build()."
      );
    }
    if (this.ingredients.length === 0) {
      throw new Error(
        "Cannot build Recipe: add at least one ingredient before build()."
      );
    }
    return new Recipe(
      this.id ?? crypto.randomUUID(),
      this.name,
      this.servings,
      this.ingredients,
    );
  }
}
