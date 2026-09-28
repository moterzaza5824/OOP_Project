import { afterEach, describe, expect, it, vi } from 'vitest'
import { scrollToTarget } from './scrollToTarget'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('scrollToTarget', () => {
  it('scrolls to the edit form from its top edge', () => {
    const element = {
      focus: vi.fn(),
      scrollIntoView: vi.fn(),
    }
    const getElementById = vi.fn(() => element)
    vi.stubGlobal('document', { getElementById })

    expect(scrollToTarget({ type: 'form' })).toBe(true)
    expect(getElementById).toHaveBeenCalledWith('recipe-form-panel')
    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(element.focus).not.toHaveBeenCalled()
  })

  it('returns to and focuses the edited recipe card', () => {
    const element = {
      focus: vi.fn(),
      scrollIntoView: vi.fn(),
    }
    const getElementById = vi.fn(() => element)
    vi.stubGlobal('document', { getElementById })

    expect(
      scrollToTarget({ type: 'recipe', recipeId: 'recipe-123' }),
    ).toBe(true)
    expect(getElementById).toHaveBeenCalledWith('recipe-recipe-123')
    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })
    expect(element.focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('does nothing when the target is no longer on the page', () => {
    vi.stubGlobal('document', { getElementById: () => null })
    expect(scrollToTarget({ type: 'recipe', recipeId: 'missing' })).toBe(false)
  })
})
