import { test, expect, describe } from 'vitest'
import { genTemplate } from './index'

describe(genTemplate.name, () => {
  test('Reusing utils', () => {
    const text = genTemplate((utils) => {
      utils.h2('123')
      utils.h3('456')
    })
    expect(text).toMatchSnapshot()
  })
  test('Reusing deep utils', () => {
    const text = genTemplate((utils) => {
      utils.h2('123').listItem('item 1').listItem('item 2').end()
      utils.h3('456')
    })
    expect(text).toMatchSnapshot()
  })
  test('Default empty content', () => {
    const text = genTemplate()
    expect(text).toMatchSnapshot()
  })
})
