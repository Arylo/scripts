import fs from 'fs'
import path from 'path'
import { describe, test, expect } from 'vitest'
import { createCaddyfile } from './createCaddyfile'

describe(createCaddyfile.name, () => {
  test('generate caddyfile', () => {
    const caddyfile = createCaddyfile()

    const globalBlock = caddyfile.addGlobalBlock()
    globalBlock.addDirectiveBlock('email', 'you@yours.com')
    globalBlock
      .addDirectiveBlock('servers')
      .addDirectiveBlock('trusted_proxies', 'static', 'private_ranges')

    const snippetBlock = caddyfile.addSnippetBlock('snippet')
    snippetBlock.addCommentBlock('this is a reusable snippet')
    snippetBlock.addDirectiveBlock('log').addDirectiveBlock('output', 'file', '/var/log/access.log')

    const siteBlock1 = caddyfile.addSiteBlock('example.com')
    siteBlock1.addMatcherBlock('post').addDirectiveBlock('method', 'POST')
    siteBlock1
      .addDirectiveBlock('reverse_proxy', '@post', 'localhost:9001', 'localhost:9002')
      .addDirectiveBlock('lb_policy', 'first')
    siteBlock1.addDirectiveBlock('file_server', '/static')
    siteBlock1.addDirectiveBlock('import', 'snippet')

    const siteBlock2 = caddyfile.addSiteBlock('www.example.com')
    siteBlock2.addDirectiveBlock('redir', 'https://example.com{uri}')
    siteBlock2.addDirectiveBlock('import', 'snippet')

    const content = fs.readFileSync(path.resolve(__dirname, '../../test-static/Caddyfile'), 'utf-8')
    const result = caddyfile.toString()
    expect(result).toBe(content)
  })
})
