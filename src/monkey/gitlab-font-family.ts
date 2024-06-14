const el = document.createElement('style')
el.id = 'append-font'

const fontStyle = '{ font-family: "Fira Code", "Smiley Sans", "Courier New", monospace; }'
const query = [
  '.blob-content.file-content.code pre code',
  'table.code tr.line_holder td.line_content',
  '.diff-grid-row'
]
query.forEach((q) => el.append(`${q} ${fontStyle}`))
document.body.append(el)