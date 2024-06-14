const elem = document.createElement('style');
elem.id = 'max-size';

const containerStyle = '{ max-width: 100%; }';
const styles = [
  `.content-wrapper nav ${containerStyle}`,
  `.content-wrapper .container-fluid ${containerStyle}`,
  `.ci-variable-table table colgroup col:nth-child(3) { width: 100px; }`,
  `.ci-variable-table table colgroup col:nth-child(4) { width: 200px; }`,
  `.ci-variable-table table colgroup col:nth-child(5) { width: 50px; }`,
];
styles.forEach((style) => elem.append(style));

setTimeout(() => {
  document.head.append(elem)
}, 25)

export {}
