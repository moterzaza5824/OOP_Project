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
  // ค่าเริ่มต้นเป็น null เพื่อให้ build() ตรวจได้ว่าส่วนใดยังไม่ได้กำหนด
  private id: string | null = null;
  private name: string | null = null;
  private servings: number | null = null;
  // เก็บวัตถุดิบที่เพิ่มเข้ามาทีละรายการก่อนสร้าง Recipe จริง
  private ingredients: Ingredient[] = [];

  public setId(id: string): this {
    // id ต้องไม่ว่าง เพราะใช้ระบุตัวสูตรตอนแก้ไขหรือลบ
    if (!id || id.trim().length === 0) {
      throw new Error('Recipe id must not be empty.');
    }
    // เก็บ id หลังตัดช่องว่างส่วนเกิน
    this.id = id.trim();
    // คืน this เพื่อให้เรียกเมธอดถัดไปแบบ fluent interface
    return this;
  }

  public setName(name: string): this {
    // ป้องกันการสร้างสูตรที่ไม่มีชื่อ
    if (!name || name.trim().length === 0) {
      throw new Error("Recipe name must not be empty.");
    }
    // เก็บชื่อที่ผ่านการตรวจสอบแล้ว
    this.name = name.trim();
    // คืน Builder ตัวเดิมเพื่อเรียก setServings() ต่อได้
    return this;
  }

  public setServings(servings: number): this {
    // จำนวนเสิร์ฟต้องเป็นตัวเลขและมากกว่าศูนย์
    if (!Number.isFinite(servings) || servings <= 0) {
      throw new Error(`Servings must be greater than 0 (got: ${servings}).`);
    }
    // เก็บจำนวนเสิร์ฟไว้จนกว่าจะเรียก build()
    this.servings = servings;
    // คืน Builder ตัวเดิมเพื่อให้ chain เมธอดต่อได้
    return this;
  }

  /**
   * Accepts any Ingredient subtype. Polymorphism means this method doesn't
   * need to know whether it is measured by weight, volume, or count.
   * Each Ingredient already validated itself in its own constructor.
   */
  public addIngredient(ingredient: Ingredient): this {
    // รับได้ทุก subclass ของ Ingredient ตามหลัก Polymorphism
    this.ingredients.push(ingredient);
    // คืน this เพื่อเพิ่มวัตถุดิบหลายรายการต่อเนื่องกันได้
    return this;
  }

  public build(): Recipe {
    // ตรวจว่าผู้เรียกกำหนดชื่อแล้วก่อนสร้าง Recipe
    if (this.name === null) {
      throw new Error("Cannot build Recipe: call setName() before build().");
    }
    // ตรวจว่าผู้เรียกกำหนดจำนวนเสิร์ฟแล้ว
    if (this.servings === null) {
      throw new Error(
        "Cannot build Recipe: call setServings() before build()."
      );
    }
    // สูตรที่สมบูรณ์ต้องมีวัตถุดิบอย่างน้อยหนึ่งรายการ
    if (this.ingredients.length === 0) {
      throw new Error(
        "Cannot build Recipe: add at least one ingredient before build()."
      );
    }
    // สร้าง Recipe เมื่อข้อมูลครบ หากไม่มี id ให้สร้าง UUID ใหม่อัตโนมัติ
    return new Recipe(
      this.id ?? crypto.randomUUID(),
      this.name,
      this.servings,
      this.ingredients,
    );
  }
}
