import type { Recipe } from '../models/Recipe'

export type RecipeSortOption = 'latest' | 'name' | 'servings'

/**
 * Service สำหรับจัดการชุดสูตรอาหาร เช่น เพิ่ม แก้ไข ลบ ค้นหา และเรียงลำดับ
 *
 * คลาสนี้ทำงานแบบ immutable: ทุกการเปลี่ยนแปลงจะคืน RecipeManager ตัวใหม่แทน
 * การแก้ไขอาร์เรย์เดิม จึงนำไปใช้กับ state ของ React ได้อย่างปลอดภัยและคาดเดาง่าย
 */
export class RecipeManager {
  // readonly ป้องกันการเปลี่ยน reference ของรายการภายในคลาส
  private readonly recipes: Recipe[]

  constructor(recipes: Recipe[] = []) {
    // กระจายอาร์เรย์เป็นสำเนา ป้องกันผู้เรียกแก้อาร์เรย์ภายในจากภายนอก
    this.recipes = [...recipes]
  }

  public getRecipes(): Recipe[] {
    // คืนสำเนาอาร์เรย์เพื่อรักษา Encapsulation
    return [...this.recipes]
  }

  public addRecipe(recipe: Recipe): RecipeManager {
    // id ของแต่ละสูตรต้องไม่ซ้ำกัน
    if (this.recipes.some((current) => current.getId() === recipe.getId())) {
      throw new Error(`Recipe id already exists: ${recipe.getId()}`)
    }

    // คืน Manager ตัวใหม่พร้อมสูตรที่เพิ่ม โดยไม่แก้อาร์เรย์เดิม
    return new RecipeManager([...this.recipes, recipe])
  }

  public updateRecipe(id: string, replacement: Recipe): RecipeManager {
    // ค้นหาตำแหน่งสูตรจาก id
    const index = this.recipes.findIndex((recipe) => recipe.getId() === id)
    // แจ้งข้อผิดพลาดถ้าไม่พบสูตรที่ต้องการแก้ไข
    if (index === -1) {
      throw new Error(`Recipe not found: ${id}`)
    }
    // สูตรใหม่ต้องรักษา id เดิม เพื่อไม่ให้การอ้างอิงสูตรเปลี่ยนไป
    if (replacement.getId() !== id) {
      throw new Error('Replacement recipe must preserve the original id.')
    }

    // คัดลอกอาร์เรย์ก่อนแทนที่สูตร เพื่อทำงานแบบ immutable
    const updated = [...this.recipes]
    updated[index] = replacement
    // คืน Manager ตัวใหม่ ส่วน Manager เดิมยังมีข้อมูลเดิม
    return new RecipeManager(updated)
  }

  public deleteRecipe(id: string): RecipeManager {
    // ตรวจสอบก่อนว่ามีสูตรที่ต้องการลบอยู่จริง
    if (!this.recipes.some((recipe) => recipe.getId() === id)) {
      throw new Error(`Recipe not found: ${id}`)
    }

    // filter สร้างอาร์เรย์ใหม่ที่ไม่มีสูตรตาม id ที่ระบุ
    return new RecipeManager(
      this.recipes.filter((recipe) => recipe.getId() !== id),
    )
  }

  public searchRecipes(searchTerm: string): Recipe[] {
    // ตัดช่องว่างและแปลงเป็นตัวพิมพ์เล็กตาม locale ภาษาไทย
    const normalizedTerm = searchTerm.trim().toLocaleLowerCase('th-TH')

    // คืนเฉพาะสูตรที่ชื่อมีข้อความค้นหาอยู่ภายใน
    return this.recipes.filter((recipe) =>
      recipe
        .getName()
        .toLocaleLowerCase('th-TH')
        .includes(normalizedTerm),
    )
  }

  public sortRecipes(
    sortOption: RecipeSortOption,
    recipes: Recipe[] = this.recipes,
  ): Recipe[] {
    // คัดลอกข้อมูลก่อน sort เพราะ Array.sort() จะแก้อาร์เรย์ต้นฉบับ
    const sorted = [...recipes]

    // เรียงชื่อตามกฎภาษาไทยเมื่อผู้ใช้เลือกตัวเลือก name
    if (sortOption === 'name') {
      return sorted.sort((first, second) =>
        first.getName().localeCompare(second.getName(), 'th'),
      )
    }

    // เรียงจำนวนเสิร์ฟจากน้อยไปมาก
    if (sortOption === 'servings') {
      return sorted.sort(
        (first, second) => first.getServings() - second.getServings(),
      )
    }

    // บันทึกลำดับเดิมของสูตรแต่ละ id เพื่อใช้เรียงสูตรล่าสุดก่อน
    const order = new Map(
      this.recipes.map((recipe, index) => [recipe.getId(), index]),
    )
    // index มากกว่าหมายถึงถูกเพิ่มภายหลัง จึงนำมาแสดงก่อน
    return sorted.sort(
      (first, second) =>
        (order.get(second.getId()) ?? -1) -
        (order.get(first.getId()) ?? -1),
    )
  }
}
