import path from 'path'

export const ROOT_PATH = path.resolve(__dirname, '..')

export const githubInfo = {
  domain: 'https://raw.githubusercontent.com',
  repo: 'Arylo/scripts',
  branch: 'monkey',
}

export const POLYFILL_PATH = path.resolve(ROOT_PATH, 'src/monkey/polyfill')
