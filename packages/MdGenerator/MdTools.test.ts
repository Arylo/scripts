import { test, expect, describe } from 'vitest'
import * as mdTools from './MdTools'

describe('Markdown Tools', () => {
  describe(mdTools.indent.name, () => {
    test('Level 1', () => expect(mdTools.indent(1)).toMatchSnapshot())
    test('Level 1 with text', () => expect(mdTools.indent(1, 'text')).toMatchSnapshot())
    test('Level 2', () => expect(mdTools.indent(2)).toMatchSnapshot())
    test('Level 2 with text', () => expect(mdTools.indent(2, 'text')).toMatchSnapshot())
    test('Level 3', () => expect(mdTools.indent(3)).toMatchSnapshot())
    test('Level 3 with text', () => expect(mdTools.indent(3, 'text')).toMatchSnapshot())
    test('Level 4', () => expect(mdTools.indent(4)).toMatchSnapshot())
    test('Level 4 with text', () => expect(mdTools.indent(4, 'text')).toMatchSnapshot())
    test('Level 5', () => expect(mdTools.indent(5)).toMatchSnapshot())
    test('Level 5 with text', () => expect(mdTools.indent(5, 'text')).toMatchSnapshot())
  })

  test(mdTools.enter.name, () => {
    expect(mdTools.enter()).toMatchSnapshot()
  })

  describe(mdTools.h1.name, () => {
    test('No title', () => expect(mdTools.h1()).toMatchSnapshot())
    test('Exist title', () => expect(mdTools.h1('Text')).toMatchSnapshot())
  })
  describe(mdTools.h2.name, () => {
    test('No title', () => expect(mdTools.h2()).toMatchSnapshot())
    test('Exist title', () => expect(mdTools.h2('Text')).toMatchSnapshot())
  })
  describe(mdTools.h3.name, () => {
    test('No title', () => expect(mdTools.h3()).toMatchSnapshot())
    test('Exist title', () => expect(mdTools.h3('Text')).toMatchSnapshot())
  })
  describe(mdTools.h4.name, () => {
    test('No title', () => expect(mdTools.h4()).toMatchSnapshot())
    test('Exist title', () => expect(mdTools.h4('Text')).toMatchSnapshot())
  })
  describe(mdTools.h5.name, () => {
    test('No title', () => expect(mdTools.h5()).toMatchSnapshot())
    test('Exist title', () => expect(mdTools.h5('Text')).toMatchSnapshot())
  })

  describe(mdTools.text.name, () => {
    test('No content', () => expect(mdTools.text()).toMatchSnapshot())
    test('Exist content', () => expect(mdTools.text('text')).toMatchSnapshot())
  })

  test(mdTools.anchor.name, () => expect(mdTools.anchor('key', 'https://example.com/pathname')).toMatchSnapshot())
  test(mdTools.hyperlink.name, () => expect(mdTools.hyperlink('label', 'https://example.com/pathname')).toMatchSnapshot())
  test(mdTools.hyperlinkWithKey.name, () => expect(mdTools.hyperlinkWithKey('label', 'key')).toMatchSnapshot())
  describe(mdTools.image.name, () => {
    test('No alt', () => expect(mdTools.image('https://example.com/pathname')).toMatchSnapshot())
    test('Exist alt', () => expect(mdTools.image('https://example.com/pathname', 'alt')).toMatchSnapshot())
  })
  describe(mdTools.imageByKey.name, () => {
    test('No alt', () => expect(mdTools.imageByKey('key')).toMatchSnapshot())
    test('Exist alt', () => expect(mdTools.imageByKey('key', 'alt')).toMatchSnapshot())
  })
  describe(mdTools.listItem.name, () => {
    test('No content', () => expect(mdTools.listItem('')).toMatchSnapshot())
    test('Exist content', () => expect(mdTools.listItem('Text')).toMatchSnapshot())
  })
  describe(mdTools.taskItem.name, () => {
    test('No content', () => expect(mdTools.taskItem('')).toMatchSnapshot())
    test('Exist content', () => expect(mdTools.taskItem('Text')).toMatchSnapshot())
    test('No content with empty options', () => expect(mdTools.taskItem('', { })).toMatchSnapshot())
    test('Exist content with empty options', () => expect(mdTools.taskItem('Text', { })).toMatchSnapshot())
    test('No content and unselect', () => expect(mdTools.taskItem('', { selected: false })).toMatchSnapshot())
    test('Exist content and unselect', () => expect(mdTools.taskItem('Text', { selected: false })).toMatchSnapshot())
    test('No content and selected', () => expect(mdTools.taskItem('', { selected: true })).toMatchSnapshot())
    test('Exist content and selected', () => expect(mdTools.taskItem('Text', { selected: true })).toMatchSnapshot())
  })
})
