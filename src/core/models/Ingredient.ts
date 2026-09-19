/**
 * Ingredient (base class)
 * -----------------------
 * OOP points on purpose here:
 * - Encapsulation: fields are `protected` (not `private`) — outside code
 *   still can't touch them directly, only through getName()/getQuantity()/
 *   getUnit()/setQuantity(). `protected` (rather than `private`) is what
 *   lets SolidIngredient/LiquidIngredient reach `this.name` etc. directly
 *   inside their own overridden methods below.
 * - Inheritance: SolidIngredient and LiquidIngredient both extend this
 *   class and reuse every field/getter/setter here — they only add their
 *   own display format.
 * - Polymorphism: getDisplayText() and withScaledQuantity() are both
 *   designed to be overridden — see SolidIngredient.ts / LiquidIngredient.ts.
 */
export class Ingredient {
  protected name: string;
  protected quantity: number;
  protected unit: string;

  constructor(name: string, quantity: number, unit: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("Ingredient name must not be empty.");
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(
        `Ingredient quantity must be greater than 0 (got: ${quantity}).`
      );
    }
    if (!unit || unit.trim().length === 0) {
      throw new Error("Ingredient unit must not be empty.");
    }
    this.name = name.trim();
    this.quantity = quantity;
    this.unit = unit.trim();
  }

  public getName(): string {
    return this.name;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnit(): string {
    return this.unit;
  }

  /** Validated setter — mutates this Ingredient's quantity directly. */
  public setQuantity(quantity: number): void {
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`Quantity must be greater than 0 (got: ${quantity}).`);
    }
    this.quantity = quantity;
  }

  /** Polymorphism point #1 — overridden in SolidIngredient/LiquidIngredient. */
  public getDisplayText(): string {
    return `${this.name} - ${this.quantity} ${this.unit}`;
  }

  /**
   * Polymorphism point #2 — used by RecipeScaler to produce a scaled copy.
   * Overridden in each subclass so that scaling a SolidIngredient still
   * returns a SolidIngredient (not a plain base Ingredient), without
   * RecipeScaler ever needing an `instanceof` check to know which kind of
   * ingredient it's holding.
   */
  public withScaledQuantity(factor: number): Ingredient {
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new Error(`Scale factor must be greater than 0 (got: ${factor}).`);
    }
    return new Ingredient(this.name, this.quantity * factor, this.unit);
  }
}