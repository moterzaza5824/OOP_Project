import { useState } from 'react'
import type { Recipe } from '../core/models/Recipe'
import { RecipeScaler } from '../core/services/RecipeScaler'

type ScaleModalProps = {
  recipe: Recipe
  onClose: () => void
}

function formatQuantity(quantity: number): string {
  if (Number.isInteger(quantity)) {
    return String(quantity)
  }

  return quantity.toFixed(2).replace(/\.?0+$/, '')
}

export function ScaleModal({ recipe, onClose }: ScaleModalProps) {
  const [targetServings, setTargetServings] = useState(
    recipe.getServings(),
  )

  const scaledRecipe = RecipeScaler.scale(recipe, targetServings)
  const originalIngredients = recipe.getIngredients()
  const scaledIngredients = scaledRecipe.getIngredients()

  function decreaseServings() {
    setTargetServings((current) => Math.max(1, current - 1))
  }

  function increaseServings() {
    setTargetServings((current) => current + 1)
  }

  return (
    <div className="scale-modal__backdrop" onClick={onClose}>
      <section
        className="scale-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scale-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="scale-modal__header">
          <div>
            <h2 id="scale-modal-title">คำนวณสัดส่วนวัตถุดิบ</h2>
            <p>เมนู: {recipe.getName()}</p>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="ปิดหน้าต่าง"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="scale-modal__controls">
          <div>
            <span>สูตรต้นฉบับ</span>
            <strong>{recipe.getServings()} ที่</strong>
          </div>

          <span aria-hidden="true">→</span>

          <div>
            <span>จำนวนที่ต้องการ</span>

            <div className="serving-stepper">
              <button type="button" onClick={decreaseServings}>
                −
              </button>

              <strong>{targetServings} ที่</strong>

              <button type="button" onClick={increaseServings}>
                +
              </button>
            </div>
          </div>
        </div>

        <div className="scale-modal__ingredients">
          <h3>รายการวัตถุดิบ</h3>

          <ul>
            {scaledIngredients.map((ingredient, index) => (
              <li key={`${ingredient.getName()}-${index}`}>
                <div>
                  <strong>{ingredient.getName()}</strong>
                  <span>
                    ต้นฉบับ:{' '}
                    {formatQuantity(
                      originalIngredients[index].getQuantity(),
                    )}{' '}
                    {originalIngredients[index].getUnit()}
                  </span>
                </div>

                <strong>
                  {formatQuantity(ingredient.getQuantity())}{' '}
                  {ingredient.getUnit()}
                </strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="scale-modal__footer">
          <p>ปริมาณต้นฉบับจะไม่ถูกเปลี่ยนแปลง</p>

          <button
            type="button"
            className="button button--primary"
            onClick={onClose}
          >
            เสร็จสิ้น
          </button>
        </div>
      </section>
    </div>
  )
}