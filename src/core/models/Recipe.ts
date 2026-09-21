import { Ingredient } from "./Ingredient";

/**
 * Recipe
 * ------
 * @internal Should only be constructed via RecipeBuilder.build() — that's
 * the Builder Pattern requirement of the project (see RecipeBuilder.ts).
 * By the time you HAVE a Recipe object, it's guaranteed valid because
 * RecipeBuilder already checked everything before calling this
 * constructor.
 *
 * Fields are declared explicitly (not via constructor parameter-property
 * shorthand) so this compiles cleanly under Vite's newer
 * `erasableSyntaxOnly` TypeScript setting, which some project templates
 * enable by default.
 */
export class Recipe {
  private name: string;
  private servings: number;
  private ingredients: Ingredient[];

  constructor(name: string, servings: number, ingredients: Ingredient[]) {
    this.name = name;
    this.servings = servings;
    this.ingredients = [...ingredients]; // defensive copy on the way in
  }

  public getName(): string {
    return this.name;
  }

  public getServings(): number {
    return this.servings;
  }

  /**
   * Returns a COPY of the ingredients array — not the real one — so
   * outside code can't push/splice/mutate the Recipe's internal list
   * without going through RecipeBuilder.
   */
  public getIngredients(): Ingredient[] {
    return [...this.ingredients];
  }

  /** Human-readable summary; uses each ingredient's own getDisplayText()
   *  (polymorphic — Solid/Liquid ingredients print their own label). */
  public describe(): string {
    const lines = [
      this.name,
      `Servings: ${this.servings}`,
      ...this.ingredients.map((i) => `  ${i.getDisplayText()}`),
    ];
    return lines.join("\n");
  }
}