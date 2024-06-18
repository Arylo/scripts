export const appendStyleElement = (cssContent: string, id?: string) => {
  const elem = document.createElement('style')
  id && (elem.id = id)
  elem.innerText = cssContent.replace(/\n/g, '')

  document.body.append(elem)
}
