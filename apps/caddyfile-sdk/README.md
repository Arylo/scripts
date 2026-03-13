# @arylo/caddyfile-sdk

SDK for parsing, manipulating, and generating Caddyfile content.

## Features

- Create Caddyfile structures with a typed API
- Parse existing Caddyfile text into editable objects
- Generate Caddyfile text with `toString()`
- Support global, snippet, site, matcher, directive, and comment blocks
- Enforce common uniqueness rules, such as a single root global block

## Install

```bash
npm install @arylo/caddyfile-sdk
```

## Usage

### Create a Caddyfile

```ts
import { createCaddyfile } from '@arylo/caddyfile-sdk'

const caddyfile = createCaddyfile()

const globalBlock = caddyfile.addGlobalBlock()
globalBlock.addDirectiveBlock('email', 'you@yours.com')
globalBlock
  .addDirectiveBlock('servers')
  .addDirectiveBlock('trusted_proxies', 'static', 'private_ranges')

const snippetBlock = caddyfile.addSnippetBlock('snippet')
snippetBlock.addCommentBlock('this is a reusable snippet')
snippetBlock.addDirectiveBlock('log').addDirectiveBlock('output', 'file', '/var/log/access.log')

const siteBlock = caddyfile.addSiteBlock('example.com')
siteBlock.addMatcherBlock('post').addDirectiveBlock('method', 'POST')
siteBlock
  .addDirectiveBlock('reverse_proxy', '@post', 'localhost:9001', 'localhost:9002')
  .addDirectiveBlock('lb_policy', 'first')
siteBlock.addDirectiveBlock('file_server', '/static')
siteBlock.addDirectiveBlock('import', 'snippet')

console.log(caddyfile.toString())
```

Output:

```caddyfile
{
  email you@yours.com
  servers {
    trusted_proxies static private_ranges
  }
}
(snippet) {
  # this is a reusable snippet
  log {
    output file /var/log/access.log
  }
}
example.com {
  @post {
    method POST
  }
  reverse_proxy @post localhost:9001 localhost:9002 {
    lb_policy first
  }
  file_server /static
  import snippet
}
```

### Parse a Caddyfile

```ts
import { parseCaddyfile } from '@arylo/caddyfile-sdk'

const caddyfile = parseCaddyfile(`
example.com {
  respond "hello"
}
`)

const siteBlock = caddyfile.listSiteBlock()[0]
siteBlock.addDirectiveBlock('encode', 'gzip')

console.log(caddyfile.toString())
```

## API

### `createCaddyfile()`

Creates a new empty Caddyfile object.

### `parseCaddyfile(text)`

Parses Caddyfile text and returns an editable Caddyfile object.

### Root block helpers

The returned Caddyfile object supports:

- `addGlobalBlock()`
- `removeGlobalBlock()`
- `hasGlobalBlock()`
- `getGlobalBlock()`
- `addSnippetBlock(name)`
- `removeSnippetBlockById(id)`
- `getSnippetBlockByName(name)`
- `listSnippetBlock()`
- `addSiteBlock(name | names)`
- `removeSiteBlockById(id)`
- `getSiteBlockById(id)`
- `listSiteBlock()`
- `addCommentBlock(comment)`
- `removeCommentBlockById(id)`
- `getCommentBlockById(id)`
- `toString()`

Nested blocks expose helpers such as:

- `addDirectiveBlock(name, ...args)`
- `addMatcherBlock(name)`
- `addCommentBlock(comment)`

## Constraints

- Only one global block is allowed at the root level
- Root snippet names must be unique
- Matcher names must be unique within the same parent block
- Directive names must be unique within the same parent block
- Site blocks must have at least one site name

## Development

From the package directory:

- `npm run lint`
- `npm run test`
- `npm run build`

## License

MIT
