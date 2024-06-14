const elem = document.createElement('style')
elem.id = 'append-font'

const fontStyle = '{ font-family: "Fira Code", "Smiley Sans", "Courier New", monospace; }'
const query = [
  '.blob-content.file-content.code pre code',
  'table.code tr.line_holder td.line_content',
  '.diff-grid-row'
]
query.forEach((q) => elem.append(`${q} ${fontStyle}`))

document.body.append(elem)

export {}