import type { Recipe } from '../models/Recipe'

export type RecipeSortOption = 'latest' | 'name' | 'servings'

/** Immutable collection service used by React for recipe operations. */
export class RecipeManager {
  private readonly recipes: Recipe[]

  constructor(recipes: Recipe[] = []) {
    this.recipes = [...recipes]
  }

  public getRecipes(): Recipe[] {
    return [...this.recipes]
  }

  public addRecipe(recipe: Recipe): RecipeManager {
    if (this.recipes.some((current) => current.getId() === recipe.getId())) {
      throw new Error(`Recipe id already exists: ${recipe.getId()}`)
    }

    return new RecipeManager([...this.recipes, recipe])
  }

  public updateRecipe(id: string, replacement: Recipe): RecipeManager {
    const index = this.recipes.findIndex((recipe) => recipe.getId() === id)
    if (index === -1) {
      throw new Error(`Recipe not found: ${id}`)
    }
    if (replacement.getId() !== id) {
      throw new Error('Replacement recipe must preserve the original id.')
    }

    const updated = [...this.recipes]
    updated[index] = replacement
    return new RecipeManager(updated)
  }

  public deleteRecipe(id: string): RecipeManager {
    if (!this.recipes.some((recipe) => recipe.getId() === id)) {
      throw new Error(`Recipe not found: ${id}`)
    }

    return new RecipeManager(
      this.recipes.filter((recipe) => recipe.getId() !== id),
    )
  }

  public searchRecipes(searchTerm: string): Recipe[] {
    const normalizedTerm = searchTerm.trim().toLocaleLowerCase('th-TH')

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
    const sorted = [...recipes]

    if (sortOption === 'name') {
      return sorted.sort((first, second) =>
        first.getName().localeCompare(second.getName(), 'th'),
      )
    }

    if (sortOption === 'servings') {
      return sorted.sort(
        (first, second) => first.getServings() - second.getServings(),
      )
    }

    const order = new Map(
      this.recipes.map((recipe, index) => [recipe.getId(), index]),
    )
    return sorted.sort(
      (first, second) =>
        (order.get(second.getId()) ?? -1) -
        (order.get(first.getId()) ?? -1),
    )
  }
}
