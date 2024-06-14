const el = document.createElement('style')
el.id = 'max-size'

const containerStyle = '{ max-width: 100%; }'
const styles = [
  `.content-wrapper nav ${containerStyle}`,
  `.content-wrapper .container-fluid ${containerStyle}`,
  `.ci-variable-table table colgroup col:nth-child(3) { width: 100px; }`,
  `.ci-variable-table table colgroup col:nth-child(4) { width: 200px; }`,
  `.ci-variable-table table colgroup col:nth-child(5) { width: 50px; }`,
];
styles.forEach((style) => el.append(style))

setTimeout(() => {
  document.head.append(el)
}, 25)