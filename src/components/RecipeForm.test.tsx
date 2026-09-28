import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RecipeForm } from './RecipeForm'

describe('RecipeForm', () => {
  it('asks for a unit and no longer asks users to choose a subtype', () => {
    const markup = renderToStaticMarkup(
      <RecipeForm
        onCancel={() => undefined}
        onSave={() => undefined}
      />,
    )

    expect(markup).toContain('ชื่อวัตถุดิบ')
    expect(markup).toContain('ปริมาณ')
    expect(markup).toContain('หน่วย')
    expect(markup).toContain('ลูก')
    expect(markup).not.toContain('ของแข็ง')
    expect(markup).not.toContain('ของเหลว')
    expect(markup).not.toContain('type="radio"')
  })
})
