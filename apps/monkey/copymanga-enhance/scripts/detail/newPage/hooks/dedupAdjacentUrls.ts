export default function dedupAdjacentUrls(urls: readonly string[] = []): string[] {
  return urls.filter((url, index) => index === 0 || url !== urls[index - 1])
}
