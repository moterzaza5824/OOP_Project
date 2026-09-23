import { useState, type FormEvent } from 'react'
import type { Recipe } from '../core/models/Recipe'
import { LiquidIngredient } from '../core/models/Liquidingredient'

export type IngredientDraft = {
    id: string
    name: string
    quantity: number
    unit: string
    type: 'solid' | 'liquid'
}

export type RecipeDraft = {
    name: string
    servings: number
    ingredients: IngredientDraft[]
}

type RecipeFormProps = {
    initialRecipe?: Recipe
    onCancel: () => void
    onSave: (recipe: RecipeDraft) => void
}

function createIngredientDrafts(
    recipe?: Recipe,
): IngredientDraft[] {
    if (!recipe) {
        return []
    }

    return recipe.getIngredients().map((ingredient) => ({
        id: crypto.randomUUID(),
        name: ingredient.getName(),
        quantity: ingredient.getQuantity(),
        unit: ingredient.getUnit(),
        type:
            ingredient instanceof LiquidIngredient
                ? 'liquid'
                : 'solid',
    }))
}

export function RecipeForm({
    initialRecipe,
    onCancel,
    onSave,
}: RecipeFormProps) {
    const [name, setName] = useState(
        initialRecipe?.getName() ?? '',
    )
    const [servings, setServings] = useState(
        initialRecipe?.getServings() ?? 1,
    )
    const [ingredientName, setIngredientName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unit, setUnit] = useState('กรัม')
    const [type, setType] = useState<'solid' | 'liquid'>('solid')
    const [ingredients, setIngredients] = useState<IngredientDraft[]>(
        () => createIngredientDrafts(initialRecipe),
    )
    const [error, setError] = useState('')

    function addIngredient() {
        const parsedQuantity = Number(quantity)

        if (!ingredientName.trim()) {
            setError('กรุณากรอกชื่อวัตถุดิบ')
            return
        }

        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            setError('ปริมาณวัตถุดิบต้องมากกว่า 0')
            return
        }

        setIngredients((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                name: ingredientName.trim(),
                quantity: parsedQuantity,
                unit,
                type,
            },
        ])

        setIngredientName('')
        setQuantity('')
        setError('')
    }

    function removeIngredient(id: string) {
        setIngredients((current) =>
            current.filter((ingredient) => ingredient.id !== id),
        )
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!name.trim()) {
            setError('กรุณากรอกชื่อสูตรอาหาร')
            return
        }

        if (!Number.isFinite(servings) || servings <= 0) {
            setError('จำนวนเสิร์ฟต้องมากกว่า 0')
            return
        }

        if (ingredients.length === 0) {
            setError('กรุณาเพิ่มวัตถุดิบอย่างน้อย 1 รายการ')
            return
        }

        onSave({
            name: name.trim(),
            servings,
            ingredients,
        })
    }

    return (
        <form className="recipe-form" onSubmit={handleSubmit}>
            <div className="recipe-form__header">
                <div>
                    <p className="recipe-form__eyebrow">
                        {initialRecipe ? 'กำลังแก้ไข' : 'ฉบับร่าง'}
                    </p>

                    <h2>
                        {initialRecipe
                            ? `แก้ไขสูตร ${initialRecipe.getName()}`
                            : 'สร้างสูตรอาหารใหม่'}
                    </h2>

                    <p>
                        {initialRecipe
                            ? 'แก้ไขข้อมูลหรือรายการวัตถุดิบของสูตรนี้'
                            : 'กรอกข้อมูลและเพิ่มวัตถุดิบสำหรับสูตรของคุณ'}
                    </p>
                </div>

                <button type="button" className="icon-button" onClick={onCancel}>
                    ✕
                </button>
            </div>

            {error && (
                <p className="recipe-form__error" role="alert">
                    {error}
                </p>
            )}

            <div className="recipe-form__layout">
                <div className="recipe-form__fields">
                    <div className="field">
                        <label htmlFor="recipe-name">ชื่อสูตรอาหาร</label>
                        <input
                            id="recipe-name"
                            type="text"
                            value={name}
                            placeholder="เช่น กะเพราไก่ไข่ดาว"
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="recipe-servings">จำนวนเสิร์ฟเริ่มต้น</label>
                        <input
                            id="recipe-servings"
                            type="number"
                            min="1"
                            value={servings}
                            onChange={(event) => setServings(Number(event.target.value))}
                        />
                    </div>

                    <fieldset className="ingredient-form">
                        <legend>เพิ่มรายการวัตถุดิบ</legend>

                        <div className="ingredient-form__inputs">
                            <div className="field">
                                <label htmlFor="ingredient-name">ชื่อวัตถุดิบ</label>
                                <input
                                    id="ingredient-name"
                                    type="text"
                                    value={ingredientName}
                                    placeholder="เช่น หมูสับ"
                                    onChange={(event) => setIngredientName(event.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="ingredient-quantity">ปริมาณ</label>
                                <input
                                    id="ingredient-quantity"
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="ingredient-unit">หน่วย</label>
                                <select
                                    id="ingredient-unit"
                                    value={unit}
                                    onChange={(event) => setUnit(event.target.value)}
                                >
                                    <option value="กรัม">กรัม</option>
                                    <option value="กิโลกรัม">กิโลกรัม</option>
                                    <option value="มิลลิลิตร">มิลลิลิตร</option>
                                    <option value="ลิตร">ลิตร</option>
                                    <option value="ชิ้น">ชิ้น</option>
                                    <option value="ฟอง">ฟอง</option>
                                    <option value="ช้อนชา">ช้อนชา</option>
                                    <option value="ช้อนโต๊ะ">ช้อนโต๊ะ</option>
                                    <option value="ถ้วย">ถ้วย</option>
                                </select>
                            </div>
                        </div>

                        <div className="ingredient-form__actions">
                            <div className="ingredient-type">
                                <label>
                                    <input
                                        type="radio"
                                        name="ingredient-type"
                                        checked={type === 'solid'}
                                        onChange={() => setType('solid')}
                                    />
                                    ของแข็ง
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="ingredient-type"
                                        checked={type === 'liquid'}
                                        onChange={() => setType('liquid')}
                                    />
                                    ของเหลว
                                </label>
                            </div>

                            <button type="button" onClick={addIngredient}>
                                + เพิ่มวัตถุดิบ
                            </button>
                        </div>
                    </fieldset>
                </div>

                <aside className="ingredient-preview">
                    <h3>วัตถุดิบที่เพิ่มแล้ว ({ingredients.length})</h3>

                    {ingredients.length === 0 ? (
                        <p>ยังไม่มีวัตถุดิบ</p>
                    ) : (
                        <ol>
                            {ingredients.map((ingredient) => (
                                <li key={ingredient.id}>
                                    <div>
                                        <strong>{ingredient.name}</strong>
                                        <span>
                                            {ingredient.quantity} {ingredient.unit}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        aria-label={`ลบ ${ingredient.name}`}
                                        onClick={() => removeIngredient(ingredient.id)}
                                    >
                                        ลบ
                                    </button>
                                </li>
                            ))}
                        </ol>
                    )}
                </aside>
            </div>

            <div className="recipe-form__footer">
                <button type="button" onClick={onCancel}>
                    ยกเลิก
                </button>

                <button type="submit" className="button button--primary">
                    {initialRecipe ? 'บันทึกการแก้ไข' : 'บันทึกสูตร'}
                </button>
            </div>
        </form>
    )
}