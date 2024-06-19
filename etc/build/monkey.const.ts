import { githubInfo } from '../consts'

export const bannerOrderMap = {
  head: [
    'name',
    'namespace',
    'copyright',
    'description',
    'icon',
    'iconURL',
    'defaulticon',
    'icon64',
    'icon64URL',
    'version',
    'author'
  ],
  tail: [
    'homepage',
    'homepageURL',
    'website',
    'source',
    'downloadURL',
    'updateURL',
    'supportURL',
    'run-at',
    'grant'
  ],
}

const { domain, repo, branch } = githubInfo
export const githubRawPrefix = `${domain}/${repo}/${branch}`
