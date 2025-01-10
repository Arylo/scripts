export function genID (length = 32): string {
  if (typeof length !== 'number' || length < 32) return genID();
  let text = Date.now().toString(16);
  const lostLength = length - text.length;
  const endIndex = Math.min(Math.round((lostLength - 1) / 2), 10);
  while (text.length < length) {
    text += Number((Math.random() * 10e16).toFixed(0)).toString(16).substring(0, endIndex);
  }
  return text.substring(0, length).toUpperCase();
}

export default genID
