import type { Recipe } from '../core/models/Recipe'


type RecipeCardProps = {
  recipe: Recipe
  onEdit: () => void
  onDelete: () => void
  onScale: () => void
}

export function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  onScale,
}: RecipeCardProps) {
  const ingredients = recipe.getIngredients()
  const visibleIngredients = ingredients.slice(0, 3)
  const remainingCount = ingredients.length - visibleIngredients.length

  return (
    <article className="recipe-card">
      <div className="recipe-card__topbar">
        <span className="recipe-card__servings">
          สำหรับ {recipe.getServings()} ที่
        </span>

        <div className="recipe-card__actions">
          <button
            type="button"
            aria-label={`แก้ไขสูตร ${recipe.getName()}`}
            title="แก้ไขสูตร"
            onClick={onEdit}
          >
            แก้ไข
          </button>

          <button
            type="button"
            className="recipe-card__delete"
            aria-label={`ลบสูตร ${recipe.getName()}`}
            title="ลบสูตร"
            onClick={onDelete}
          >
            ลบ
          </button>
        </div>
      </div>

      <h3>{recipe.getName()}</h3>
      <p className="recipe-card__meta">
        วัตถุดิบ {ingredients.length} รายการ
      </p>

      <ul className="recipe-card__ingredients">
        {visibleIngredients.map((ingredient, index) => (
          <li key={`${ingredient.getName()}-${index}`}>
            <span>{ingredient.getName()}</span>
            <strong>
              {ingredient.getQuantity()} {ingredient.getUnit()}
            </strong>
          </li>
        ))}
      </ul>

      {remainingCount > 0 && (
        <p className="recipe-card__more">และอีก {remainingCount} รายการ</p>
      )}

      <div className="recipe-card__footer">
        <button
          type="button"
          className="recipe-card__scale-button"
          onClick={onScale}
        >
          ปรับจำนวน
        </button>
      </div>
    </article>
  )
}
