import { describe, expect, test } from 'vitest'
import Caddyfile from './Caddyfile'

describe(Caddyfile.name, () => {
  test('root level allows only one global block', () => {
    const caddyfile = new Caddyfile()

    caddyfile.addGlobalBlock()

    expect(() => caddyfile.addGlobalBlock()).toThrow(
      'Only one Global block is allowed at root level',
    )
  })

  test('root level snippet block names must be unique', () => {
    const caddyfile = new Caddyfile()

    caddyfile.addSnippetBlock('common')

    expect(() => caddyfile.addSnippetBlock('common')).toThrow(
      'Snippet block name must be unique at root level: common',
    )
  })

  test('root level allows multiple site blocks', () => {
    const caddyfile = new Caddyfile()

    caddyfile.addSiteBlock('example.com')
    caddyfile.addSiteBlock('example.org')

    expect(caddyfile.listSiteBlock()).toHaveLength(2)
  })

  test('site block must have at least one name', () => {
    const caddyfile = new Caddyfile()

    expect(() => caddyfile.addSiteBlock([])).toThrow('Site block must have at least one name')
    expect(() => caddyfile.addSiteBlock('')).toThrow('Site block must have at least one name')
  })

  test('site block matcher names must be unique', () => {
    const siteBlock = new Caddyfile().addSiteBlock('example.com')

    siteBlock.addMatcherBlock('api')

    expect(() => siteBlock.addMatcherBlock('@api')).toThrow(
      'Matcher block name must be unique in the same parent block: api',
    )
  })

  test.each([
    ['global block', () => new Caddyfile().addGlobalBlock()],
    ['snippet block', () => new Caddyfile().addSnippetBlock('common')],
    ['site block', () => new Caddyfile().addSiteBlock('example.com')],
    ['matcher block', () => new Caddyfile().addSiteBlock('example.com').addMatcherBlock('api')],
  ])('directive names must be unique within %s', (_, createBlock) => {
    const block = createBlock()

    block.addDirectiveBlock('encode', 'gzip')

    expect(() => block.addDirectiveBlock('encode', 'zstd')).toThrow(
      'Directive block name must be unique in the same parent block: encode',
    )
  })

  test('subdirective names must be unique within a directive block', () => {
    const directiveBlock = new Caddyfile().addGlobalBlock().addDirectiveBlock('servers')

    directiveBlock.addDirectiveBlock('trusted_proxies', 'static', 'private_ranges')

    expect(() => directiveBlock.addDirectiveBlock('trusted_proxies', 'static', 'loopback')).toThrow(
      'Directive block name must be unique in the same parent block: trusted_proxies',
    )
  })
})
