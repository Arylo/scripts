import { githubInfo } from '../consts'

export const bannerOrderMap = {
  head: [
    'name',
    /^name:\w+$/,
    'namespace',
    'copyright',
    'description',
    /^description:\w+/,
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
