export const parseConstant = (pathname: string) => {
  const match = pathname.match(/\/comic\/(\w+)(?:\/chapter\/(\w+))?/)
  if (!match) {
    return {}
  }
  return {
    comic: match[1],
    chapter: match[2],
  }
}

export default parseConstant
