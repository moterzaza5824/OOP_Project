import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { RecipeCard } from './components/RecipeCard'
import {
  RecipeForm,
  type RecipeDraft,
} from './components/RecipeForm'
import { ScaleModal } from './components/ScaleModal'
import { RecipeBuilder } from './core/builders/RecipeBuilder'
import { SolidIngredient } from './core/models/Solidingredient'
import { LiquidIngredient } from './core/models/Liquidingredient'
import type { Recipe } from './core/models/Recipe'
import './App.css'
import {
  loadRecipes,
  saveRecipes,
} from './storage/recipeStorage'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'

type SortOption = 'latest' | 'name' | 'servings'

function App() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>(
    () => loadRecipes(),
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('latest')
  const [statusMessage, setStatusMessage] = useState('')
  const [recipeToScale, setRecipeToScale] = useState<Recipe | null>(null)
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null)
  useEffect(() => {
    saveRecipes(recipes)
  }, [recipes])
  const [recipeToDelete, setRecipeToDelete] =
    useState<Recipe | null>(null)

  function handleSaveRecipe(draft: RecipeDraft) {
    try {
      const builder = new RecipeBuilder()
        .setName(draft.name)
        .setServings(draft.servings)

      for (const ingredient of draft.ingredients) {
        const recipeIngredient =
          ingredient.type === 'solid'
            ? new SolidIngredient(
              ingredient.name,
              ingredient.quantity,
              ingredient.unit,
            )
            : new LiquidIngredient(
              ingredient.name,
              ingredient.quantity,
              ingredient.unit,
            )

        builder.addIngredient(recipeIngredient)
      }

      const recipe = builder.build()
      const isEditing = recipeToEdit !== null

      setRecipes((current) =>
        isEditing
          ? current.map((currentRecipe) =>
            currentRecipe === recipeToEdit
              ? recipe
              : currentRecipe,
          )
          : [...current, recipe],
      )

      setIsCreateFormOpen(false)
      setRecipeToEdit(null)

      setStatusMessage(
        isEditing
          ? `แก้ไขสูตร “${recipe.getName()}” เรียบร้อยแล้ว`
          : `บันทึกสูตร “${recipe.getName()}” เรียบร้อยแล้ว`,
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'ไม่สามารถบันทึกสูตรอาหารได้'

      setStatusMessage(message)
    }
  }

  function handleDeleteRecipe(recipeToDelete: Recipe) {
    setRecipes((current) =>
      current.filter((recipe) => recipe !== recipeToDelete),
    )
    setStatusMessage(`ลบสูตร “${recipeToDelete.getName()}” เรียบร้อยแล้ว`)
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe
      .getName()
      .toLocaleLowerCase('th-TH')
      .includes(searchTerm.trim().toLocaleLowerCase('th-TH')),
  )

  const sortedRecipes = [...filteredRecipes].sort((first, second) => {
    if (sortOption === 'name') {
      return first.getName().localeCompare(second.getName(), 'th')
    }

    if (sortOption === 'servings') {
      return first.getServings() - second.getServings()
    }

    return recipes.indexOf(second) - recipes.indexOf(first)
  })

  return (
    <div className="app">
      <Header
        onCreateRecipe={() => {
          setRecipeToEdit(null)
          setIsCreateFormOpen(true)
          setStatusMessage('')
        }}
      />

      <main className="app-main">
        <section className="hero-section">
          <p className="hero-section__eyebrow">
            ระบบคำนวณสัดส่วนวัตถุดิบทำอาหารอัจฉริยะ
          </p>

          <h1>วันนี้กินกี่คน?</h1>

          <p>
            บันทึกสูตรโปรด แล้วปรับวัตถุดิบให้พอดีกับทุกมื้อ
            ไม่ต้องกะด้วยความรู้สึก พร้อมคำนวณอัตราส่วนอัตโนมัติ
          </p>
        </section>

        {statusMessage && (
          <p className="status-message" role="status">
            {statusMessage}
          </p>
        )}

        {isCreateFormOpen && (
          <RecipeForm
            key={
              recipeToEdit
                ? `edit-${recipes.indexOf(recipeToEdit)}`
                : 'create'
            }
            initialRecipe={recipeToEdit ?? undefined}
            onCancel={() => {
              setIsCreateFormOpen(false)
              setRecipeToEdit(null)
            }}
            onSave={handleSaveRecipe}
          />
        )}

        <section id="recipes">
          <div className="section-heading">
            <h2>สูตรอาหารของฉัน</h2>
            <span>{recipes.length}</span>

            <input
              className="recipe-search"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="ค้นหาชื่อสูตรอาหาร..."
              aria-label="ค้นหาชื่อสูตรอาหาร"
            />
            <label className="recipe-sort">
              เรียงตาม
              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as SortOption)
                }
              >
                <option value="latest">ล่าสุด</option>
                <option value="name">ชื่อ ก–ฮ</option>
                <option value="servings">จำนวนเสิร์ฟน้อยไปมาก</option>
              </select>
            </label>
          </div>

          {recipes.length === 0 ? (
            <div className="empty-state">
              <p>ยังไม่มีสูตรอาหาร</p>
              <span>กด “+ สร้างสูตรใหม่” เพื่อเพิ่มสูตรแรกของคุณ</span>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="empty-state">
              <p>ไม่พบสูตรอาหารที่ค้นหา</p>
              <span>ลองค้นหาด้วยชื่อสูตรอื่น</span>
            </div>
          ) : (
            <div className="recipe-grid">
              {sortedRecipes.map((recipe, index) => (
                <RecipeCard
                  key={`${recipe.getName()}-${index}`}
                  recipe={recipe}
                  onEdit={() => {
                    setRecipeToEdit(recipe)
                    setIsCreateFormOpen(true)
                    setStatusMessage('')
                  }}
                  onDelete={() => setRecipeToDelete(recipe)}
                  onScale={() => setRecipeToScale(recipe)}
                />
              ))}
            </div>
          )}
        </section>

        <section id="guide" className="usage-guide">
          <h2>วิธีใช้งาน</h2>
          <ol className="usage-guide__steps">
            <li>
              <h3>สร้างสูตรอาหาร</h3>
              <p>กรอกชื่อ จำนวนเสิร์ฟ และวัตถุดิบ แล้วกดบันทึกสูตร</p>
            </li>
            <li>
              <h3>ค้นหาและจัดการสูตร</h3>
              <p>ค้นหาหรือเรียงสูตรที่บันทึกไว้ และเลือกแก้ไขหรือลบได้</p>
            </li>
            <li>
              <h3>ปรับจำนวนเสิร์ฟ</h3>
              <p>เลือกสูตรแล้วระบุจำนวนคน เพื่อดูปริมาณวัตถุดิบที่คำนวณใหม่</p>
            </li>
          </ol>
          <p className="usage-guide__note">
            สูตรอาหารบันทึกในเบราว์เซอร์ของอุปกรณ์นี้เท่านั้น
            หากล้างข้อมูลเว็บไซต์ สูตรอาหารอาจหาย
          </p>
        </section>
      </main>
      {recipeToScale && (
        <ScaleModal
          recipe={recipeToScale}
          onClose={() => setRecipeToScale(null)}
        />
      )}
      {recipeToDelete && (
        <DeleteConfirmModal
          recipeName={recipeToDelete.getName()}
          onCancel={() => setRecipeToDelete(null)}
          onConfirm={() => {
            handleDeleteRecipe(recipeToDelete)
            setRecipeToDelete(null)
          }}
        />
      )}
    </div>
  )
}

export default App
