import type { Recipe } from '../models/Recipe'

export type RecipeSortOption = 'latest' | 'name' | 'servings'

/**
 * สัญญา (contract) ของ RecipeManager — คนที่ 1 กำหนด, คนที่ 2 implement
 * เป็น class RecipeManager implements IRecipeManager, คนที่ 3 เรียกใช้จาก React
 *
 * กติกา: จัดการด้วย id ไม่ใช้ object reference / index
 *  - addRecipe: เพิ่มแล้วคืน Recipe เดิม
 *  - updateRecipe: แทนที่สูตรที่ id ตรงกัน (ไม่เจอ → throw)
 *  - deleteRecipe: ลบตาม id (ไม่เจอ → คืน false)
 *  - searchRecipes: ค้นชื่อ ไม่สนตัวพิมพ์ ค่าว่างคืนทั้งหมด
 *  - sortRecipes: คืน array ใหม่ ไม่แก้ของเดิม
 *  - getRecipes: คืนสำเนา array
 */
export interface IRecipeManager {
  addRecipe(recipe: Recipe): Recipe
  updateRecipe(recipe: Recipe): Recipe
  deleteRecipe(id: string): boolean
  getRecipeById(id: string): Recipe | undefined
  searchRecipes(keyword: string): Recipe[]
  sortRecipes(recipes: Recipe[], option: RecipeSortOption): Recipe[]
  getRecipes(): Recipe[]
}
