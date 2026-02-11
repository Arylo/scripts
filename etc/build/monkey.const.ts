import { githubInfo } from '../consts'

export const bannerOrderMap = {
  head: [
    /^name(:[a-zA-Z]+(-[a-zA-Z]+)*)?$/,
    'namespace',
    'copyright',
    /^description(:[a-zA-Z]+(-[a-zA-Z]+)*)?$/,
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
    'supportURL',
    'downloadURL',
    'updateURL',
    'run-at',
    'grant'
  ],
}

const { domain, repo, branch } = githubInfo
export const githubRawPrefix = `${domain}/${repo}/${branch}`
