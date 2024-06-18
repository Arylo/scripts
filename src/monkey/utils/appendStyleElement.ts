export const appendStyleElement = (cssContent: string, id?: string) => {
  const elem = document.createElement('style')
  id && (elem.id = id)
  elem.innerHTML = cssContent

  document.body.append(elem)
}
