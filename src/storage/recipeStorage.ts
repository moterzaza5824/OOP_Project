import { RecipeBuilder } from '../core/builders/RecipeBuilder'
import { IngredientFactory } from '../core/factories/IngredientFactory'
import type { IngredientType } from '../core/models/Ingredient'
import type { Recipe } from '../core/models/Recipe'

const STORAGE_KEY = 'kin-kee-kon-recipes'
const STORAGE_VERSION = 2

type StoredIngredient = {
  name: string
  quantity: number
  unit: string
  type: IngredientType
}

type StoredRecipe = {
  id: string
  name: string
  servings: number
  ingredients: StoredIngredient[]
}

type StoredRecipeCollection = {
  version: typeof STORAGE_VERSION
  recipes: StoredRecipe[]
}

type LegacyStoredRecipe = {
  name: string
  servings: number
  ingredients: Array<{
    name: string
    quantity: number
    unit: string
    type?: 'solid' | 'liquid'
  }>
}

export function saveRecipes(recipes: Recipe[]): void {
  const collection: StoredRecipeCollection = {
    version: STORAGE_VERSION,
    recipes: recipes.map((recipe) => ({
      id: recipe.getId(),
      name: recipe.getName(),
      servings: recipe.getServings(),
      ingredients: recipe.getIngredients().map((ingredient) => ({
        name: ingredient.getName(),
        quantity: ingredient.getQuantity(),
        unit: ingredient.getUnit(),
        type: ingredient.getType(),
      })),
    })),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection))
}

function restoreRecipe(storedRecipe: StoredRecipe | LegacyStoredRecipe): Recipe {
  const builder = new RecipeBuilder()
    .setName(storedRecipe.name)
    .setServings(storedRecipe.servings)

  if ('id' in storedRecipe) {
    builder.setId(storedRecipe.id)
  }

  for (const ingredient of storedRecipe.ingredients) {
    // Unit is the source of truth and migrates legacy solid/liquid records.
    builder.addIngredient(
      IngredientFactory.create(
        ingredient.name,
        ingredient.quantity,
        ingredient.unit,
      ),
    )
  }

  return builder.build()
}

export function loadRecipes(): Recipe[] {
  const savedData = localStorage.getItem(STORAGE_KEY)

  if (!savedData) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(savedData)

    if (Array.isArray(parsed)) {
      return (parsed as LegacyStoredRecipe[]).map(restoreRecipe)
    }

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'version' in parsed &&
      parsed.version === STORAGE_VERSION &&
      'recipes' in parsed &&
      Array.isArray(parsed.recipes)
    ) {
      return (parsed.recipes as StoredRecipe[]).map(restoreRecipe)
    }

    throw new Error('Unsupported recipe storage format.')
  } catch (error) {
    console.error('ไม่สามารถโหลดสูตรอาหารได้', error)
    return []
  }
}
