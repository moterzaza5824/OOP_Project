export type ScrollTarget =
  | { type: 'form' }
  | { type: 'recipe'; recipeId: string }

export function scrollToTarget(target: ScrollTarget): boolean {
  const element =
    target.type === 'form'
      ? document.getElementById('recipe-form-panel')
      : document.getElementById(`recipe-${target.recipeId}`)

  if (!element) {
    return false
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: target.type === 'form' ? 'start' : 'center',
  })

  if (target.type === 'recipe') {
    element.focus({ preventScroll: true })
  }

  return true
}
