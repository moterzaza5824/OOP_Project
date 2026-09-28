import { useEffect, useRef, useState } from 'react'
import { Header } from './components/Header'
import { RecipeCard } from './components/RecipeCard'
import {
  RecipeForm,
  type RecipeDraft,
} from './components/RecipeForm'
import { ScaleModal } from './components/ScaleModal'
import { RecipeBuilder } from './core/builders/RecipeBuilder'
import { IngredientFactory } from './core/factories/IngredientFactory'
import type { Recipe } from './core/models/Recipe'
import {
  RecipeManager,
  type RecipeSortOption,
} from './core/services/RecipeManager'
import './App.css'
import {
  loadRecipes,
  saveRecipes,
} from './storage/recipeStorage'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import {
  scrollToTarget,
  type ScrollTarget,
} from './utils/scrollToTarget'

function App() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [recipeManager, setRecipeManager] = useState(
    () => new RecipeManager(loadRecipes()),
  )
  const recipes = recipeManager.getRecipes()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<RecipeSortOption>('latest')
  const [statusMessage, setStatusMessage] = useState('')
  const [recipeToScale, setRecipeToScale] = useState<Recipe | null>(null)
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null)
  const pendingScrollTarget = useRef<ScrollTarget | null>(null)

  useEffect(() => {
    saveRecipes(recipeManager.getRecipes())
  }, [recipeManager])

  useEffect(() => {
    const target = pendingScrollTarget.current
    if (!target) {
      return
    }

    const animationFrame = window.requestAnimationFrame(() => {
      scrollToTarget(target)
      pendingScrollTarget.current = null
    })

    return () => window.cancelAnimationFrame(animationFrame)
  }, [isCreateFormOpen, recipeManager, recipeToEdit])

  const [recipeToDelete, setRecipeToDelete] =
    useState<Recipe | null>(null)

  function handleSaveRecipe(draft: RecipeDraft) {
    try {
      const editingRecipeId = recipeToEdit?.getId()
      const builder = new RecipeBuilder()
        .setName(draft.name)
        .setServings(draft.servings)

      if (editingRecipeId) {
        builder.setId(editingRecipeId)
      }

      for (const ingredient of draft.ingredients) {
        builder.addIngredient(
          IngredientFactory.create(
            ingredient.name,
            ingredient.quantity,
            ingredient.unit,
          ),
        )
      }

      const recipe = builder.build()
      const isEditing = editingRecipeId !== undefined

      if (editingRecipeId) {
        pendingScrollTarget.current = {
          type: 'recipe',
          recipeId: editingRecipeId,
        }
      }

      setRecipeManager((current) =>
        isEditing
          ? current.updateRecipe(editingRecipeId, recipe)
          : current.addRecipe(recipe),
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
    setRecipeManager((current) =>
      current.deleteRecipe(recipeToDelete.getId()),
    )
    setStatusMessage(`ลบสูตร “${recipeToDelete.getName()}” เรียบร้อยแล้ว`)
  }

  const filteredRecipes = recipeManager.searchRecipes(searchTerm)
  const sortedRecipes = recipeManager.sortRecipes(
    sortOption,
    filteredRecipes,
  )

  return (
    <div id="top" className="app">
      <Header
        onCreateRecipe={() => {
          pendingScrollTarget.current = { type: 'form' }
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
          <div id="recipe-form-panel">
            <RecipeForm
              key={recipeToEdit?.getId() ?? 'create'}
              initialRecipe={recipeToEdit ?? undefined}
              onCancel={() => {
                if (recipeToEdit) {
                  pendingScrollTarget.current = {
                    type: 'recipe',
                    recipeId: recipeToEdit.getId(),
                  }
                }
                setIsCreateFormOpen(false)
                setRecipeToEdit(null)
              }}
              onSave={handleSaveRecipe}
            />
          </div>
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
                  setSortOption(event.target.value as RecipeSortOption)
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
              {sortedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.getId()}
                  recipe={recipe}
                  onEdit={() => {
                    pendingScrollTarget.current = { type: 'form' }
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
              <p>เลือกสูตรแล้วระบุจำนวนเสิร์ฟ เพื่อดูปริมาณวัตถุดิบที่คำนวณใหม่</p>
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
