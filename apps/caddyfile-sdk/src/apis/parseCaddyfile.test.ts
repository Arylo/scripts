import fs from 'fs'
import path from 'path'
import { expect, describe, test } from 'vitest'
import { parseCaddyfile } from './parseCaddyfile'

describe(parseCaddyfile.name, () => {
  test('parse caddyfile', () => {
    const content = fs.readFileSync(path.resolve(__dirname, '../../test-static/Caddyfile'), 'utf-8')
    const caddyfile = parseCaddyfile(content)

    expect(caddyfile.toString()).toBe(content)
  })
})
