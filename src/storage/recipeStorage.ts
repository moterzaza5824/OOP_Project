import { RecipeBuilder } from '../core/builders/RecipeBuilder'
import { LiquidIngredient } from '../core/models/Liquidingredient'
import type { Recipe } from '../core/models/Recipe'
import { SolidIngredient } from '../core/models/Solidingredient'

const STORAGE_KEY = 'kin-kee-kon-recipes'

type StoredIngredient = {
  name: string
  quantity: number
  unit: string
  type: 'solid' | 'liquid'
}

type StoredRecipe = {
  name: string
  servings: number
  ingredients: StoredIngredient[]
}

export function saveRecipes(recipes: Recipe[]): void {
  const storedRecipes: StoredRecipe[] = recipes.map((recipe) => ({
    name: recipe.getName(),
    servings: recipe.getServings(),

    ingredients: recipe.getIngredients().map((ingredient) => ({
      name: ingredient.getName(),
      quantity: ingredient.getQuantity(),
      unit: ingredient.getUnit(),
      type:
        ingredient instanceof LiquidIngredient
          ? 'liquid'
          : 'solid',
    })),
  }))

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(storedRecipes),
  )
}

export function loadRecipes(): Recipe[] {
  const savedData = localStorage.getItem(STORAGE_KEY)

  if (!savedData) {
    return []
  }

  try {
    const storedRecipes = JSON.parse(savedData) as StoredRecipe[]

    return storedRecipes.map((storedRecipe) => {
      const builder = new RecipeBuilder()
        .setName(storedRecipe.name)
        .setServings(storedRecipe.servings)

      for (const ingredient of storedRecipe.ingredients) {
        const recipeIngredient =
          ingredient.type === 'liquid'
            ? new LiquidIngredient(
                ingredient.name,
                ingredient.quantity,
                ingredient.unit,
              )
            : new SolidIngredient(
                ingredient.name,
                ingredient.quantity,
                ingredient.unit,
              )

        builder.addIngredient(recipeIngredient)
      }

      return builder.build()
    })
  } catch (error) {
    console.error('ไม่สามารถโหลดสูตรอาหารได้', error)
    return []
  }
}