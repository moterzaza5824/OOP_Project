import { beforeEach, describe, expect, it } from 'vitest'
import { RecipeBuilder } from './builders/RecipeBuilder'
import {
  IngredientFactory,
} from './factories/IngredientFactory'
import { CountIngredient } from './models/CountIngredient'
import { VolumeIngredient } from './models/VolumeIngredient'
import { WeightedIngredient } from './models/WeightedIngredient'
import { RecipeManager } from './services/RecipeManager'
import { RecipeScaler } from './services/RecipeScaler'
import { loadRecipes, saveRecipes } from '../storage/recipeStorage'

/** Storage จำลองในหน่วยความจำสำหรับทดสอบ โดยไม่ต้องใช้ localStorage ของเบราว์เซอร์ */
class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  public get length(): number {
    return this.values.size
  }

  public clear(): void {
    this.values.clear()
  }

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  public key(index: number): string | null {
    return [...this.values.keys()][index] ?? null
  }

  public removeItem(key: string): void {
    this.values.delete(key)
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

function buildRecipe(
  id: string,
  name: string,
  servings: number,
  quantity = 100,
) {
  return new RecipeBuilder()
    .setId(id)
    .setName(name)
    .setServings(servings)
    .addIngredient(IngredientFactory.create('หมู', quantity, 'กรัม'))
    .build()
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: new MemoryStorage(),
  })
})

describe('IngredientFactory', () => {
  it('maps every supported measurement family to the correct subtype', () => {
    expect(IngredientFactory.create('หมู', 100, 'กรัม')).toBeInstanceOf(
      WeightedIngredient,
    )
    expect(IngredientFactory.create('นม', 200, 'มิลลิลิตร')).toBeInstanceOf(
      VolumeIngredient,
    )
    expect(IngredientFactory.create('ไข่', 2, 'ฟอง')).toBeInstanceOf(
      CountIngredient,
    )
    expect(IngredientFactory.getTypeForUnit('ช้อนโต๊ะ')).toBe('volume')
    expect(IngredientFactory.getTypeForUnit('ลูก')).toBe('count')
    expect(IngredientFactory.getTypeForUnit('ตัว')).toBe('count')
    expect(IngredientFactory.create('ปลาดุก', 2, 'ตัว')).toBeInstanceOf(
      CountIngredient,
    )
  })

  it('rejects unsupported units instead of silently choosing a type', () => {
    expect(() => IngredientFactory.create('แป้ง', 1, 'ถุง')).toThrow(
      'Unsupported ingredient unit',
    )
  })
})

describe('RecipeScaler', () => {
  it('preserves ids and ingredient subtypes while scaling quantities', () => {
    const recipe = new RecipeBuilder()
      .setId('recipe-1')
      .setName('แพนเค้ก')
      .setServings(2)
      .addIngredient(IngredientFactory.create('แป้ง', 200, 'กรัม'))
      .addIngredient(IngredientFactory.create('นม', 300, 'มิลลิลิตร'))
      .addIngredient(IngredientFactory.create('ไข่', 3, 'ฟอง'))
      .build()

    const scaled = RecipeScaler.scale(recipe, 3)
    const ingredients = scaled.getIngredients()

    expect(scaled.getId()).toBe('recipe-1')
    expect(scaled.getServings()).toBe(3)
    expect(ingredients[0]).toBeInstanceOf(WeightedIngredient)
    expect(ingredients[0].getQuantity()).toBe(300)
    expect(ingredients[1]).toBeInstanceOf(VolumeIngredient)
    expect(ingredients[1].getQuantity()).toBe(450)
    expect(ingredients[2]).toBeInstanceOf(CountIngredient)
    expect(ingredients[2].getQuantity()).toBe(4.5)
  })
})

describe('RecipeManager', () => {
  it('performs immutable CRUD, search, and sorting operations', () => {
    const first = buildRecipe('first', 'โจ๊กหมู', 4)
    const second = buildRecipe('second', 'กะเพราไก่', 2)
    const empty = new RecipeManager()
    const manager = empty.addRecipe(first).addRecipe(second)

    expect(empty.getRecipes()).toHaveLength(0)
    expect(manager.searchRecipes('กะเพรา')).toEqual([second])
    expect(manager.sortRecipes('servings')).toEqual([second, first])
    expect(manager.sortRecipes('latest')).toEqual([second, first])

    const replacement = buildRecipe('first', 'โจ๊กหมูปรับสูตร', 6)
    const updated = manager.updateRecipe('first', replacement)
    expect(updated.getRecipes()[0].getName()).toBe('โจ๊กหมูปรับสูตร')
    expect(manager.getRecipes()[0].getName()).toBe('โจ๊กหมู')
    expect(updated.deleteRecipe('second').getRecipes()).toEqual([replacement])
    expect(() =>
      manager.updateRecipe(
        'first',
        buildRecipe('different-id', 'รหัสผิด', 1),
      ),
    ).toThrow('preserve the original id')
  })
})

describe('recipeStorage', () => {
  it('round-trips the versioned format with ids and subtypes intact', () => {
    const recipe = buildRecipe('saved-id', 'ต้มจืด', 3)
    saveRecipes([recipe])

    const loaded = loadRecipes()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].getId()).toBe('saved-id')
    expect(loaded[0].getIngredients()[0]).toBeInstanceOf(WeightedIngredient)
  })

  it('migrates legacy solid/liquid records by deriving type from unit', () => {
    localStorage.setItem(
      'kin-kee-kon-recipes',
      JSON.stringify([
        {
          name: 'ไข่ต้ม',
          servings: 1,
          ingredients: [
            { name: 'ไข่', quantity: 2, unit: 'ฟอง', type: 'solid' },
            {
              name: 'น้ำ',
              quantity: 500,
              unit: 'มิลลิลิตร',
              type: 'liquid',
            },
          ],
        },
      ]),
    )

    const ingredients = loadRecipes()[0].getIngredients()
    expect(ingredients[0]).toBeInstanceOf(CountIngredient)
    expect(ingredients[1]).toBeInstanceOf(VolumeIngredient)
  })
})
