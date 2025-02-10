# Scripts for Arylo

[![GitHub license](https://img.shields.io/github/license/arylo/scripts.svg?style=flat-square&logo=github&cacheSecond=7200)](https://github.com/arylo/scripts/)

This project contains scripts that are useful for Arylo's daily tasks.

## Monkey Scripts

|Script|Description|Install|
|--|--|--|
|set-fira-code-development-websites|Unified use of `Fira Code` as the code font to enhance developers' awareness of the code on the page|[Jump](#set-fira-code-as-font-in-development-websites)|
|nyaa-si-show-image||[Jump](#auto-show-the-source-image-for-nyaa-si)|
|~~gitlab-settings-max-size~~|~~(Deprecated)(Please use the gitlab-enhance script) Maximize the size of the CI/CD setting~~|~~[Jump](#max-size-for-gitlab-setting-page)~~|
|gitlab-font-family||[Jump](#change-gitlab-font)|
|gitlab-enhance|Enhance some features of the Self-managed Gitlab, such as the CI/CD settings page, the merge request create/edit page etc.|[Jump](#enhance-ux-for-the-self-managed-gitlab)|
|copymanga-enhance||[Jump](#enhance-ux-for-copy-manga-comic-sites)|

### Set Fira Code as font in development websites

[Top](#monkey-scripts)

#### Install Addresses

[Github][set-fira-code-development-websites_github_download_url] | [Greasyfork][set-fira-code-development-websites_greasyfork_download_url]

#### Description

![GitHub last commit][set-fira-code-development-websites_github-last-update]

Unified use of `Fira Code` as the code font to enhance developers' awareness of the code on the page

Support websites:

- https://webpack.js.org
- https://rollupjs.org
- https://jestjs.io
- https://turbo.build
- https://vite.dev
- https://vitest.dev
- https://lodash.com
- https://docs.taro.zone
- https://ajv.js.org
- https://yargs.js.org
- https://www.tampermonkey.net
- <https://*.github.io>
- https://docs.gitlab.com
- https://www.w3schools.com
- https://www.typescriptlang.org
- https://yarnpkg.com
- https://pnpm.io
- https://npmjs.com
- https://docs.npmjs.com
- https://nodejs.org/docs
- https://vuejs.org/api
- https://vueuse.org
- https://react.dev
- https://rxjs.dev
- https://axios-http.com
- https://nextjs.org
- https://docs.nestjs.com
- https://eslint.org
- https://mochajs.org
- https://toml.io
- https://ls-lint.org
- https://nodemailer.com
- https://greasyfork.org
- https://docs.docker.com
- https://developers.weixin.qq.com/miniprogram

#### Compatibility

|              |TamperMonkey|ViolentMonkey|Userscripts |
|--            |--          |--           |--          |
|Chrome        |![][pass]   |![][pass]    |            |
|Firefox       |![][unknown]|![][unknown] |            |
|Safari        |![][pass]   |             |![][unknown]|
|Safari(iOS)   |![][unknown]|             |![][unknown]|
|Edge(Chromium)|![][unknown]|![][unknown] |            |

[set-fira-code-development-websites_github_download_url]: https://raw.githubusercontent.com/Arylo/scripts/monkey/set-fira-code-development-websites.user.js
[set-fira-code-development-websites_greasyfork_download_url]: https://update.greasyfork.org/scripts/519936/Set%20Fira%20Code%20as%20font%20in%20development%20websites.user.js
[set-fira-code-development-websites_github-last-update]: https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=set-fira-code-development-websites.user.js&style=flat&label=Last%20Update

### Auto show the source image for nyaa.si

[Top](#monkey-scripts)

#### Install Addresses

[Github][nyaa-si-show-image_github_download_url]

#### Description

![GitHub last commit][nyaa-si-show-image_github-last-update]

In some scenarios show image on the `nyaa.si`

#### Compatibility

|              |TamperMonkey|ViolentMonkey|Userscripts |
|--            |--          |--           |--          |
|Chrome        |![][pass]   |![][pass]    |            |
|Firefox       |![][unknown]|![][unknown] |            |
|Safari        |![][unknown]|             |![][unknown]|
|Safari(iOS)   |![][unknown]|             |![][unknown]|
|Edge(Chromium)|![][unknown]|![][unknown] |            |

[nyaa-si-show-image_github_download_url]: https://raw.githubusercontent.com/Arylo/scripts/monkey/nyaa-si-show-image.user.js
[nyaa-si-show-image_github-last-update]: https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=nyaa-si-show-image.user.js&style=flat&label=Last%20Update

### Max Size for Gitlab setting page

[Top](#monkey-scripts)

#### Install Addresses

[Github][gitlab-settings-max-size_github_download_url]

#### Description

![GitHub last commit][gitlab-settings-max-size_github-last-update]

Expand the page size in the CI/CD settings page

#### Compatibility

|              |TamperMonkey|ViolentMonkey|Userscripts |
|--            |--          |--           |--          |
|Chrome        |![][pass]   |![][pass]    |            |
|Firefox       |![][unknown]|![][unknown] |            |
|Safari        |![][unknown]|             |![][unknown]|
|Safari(iOS)   |![][unknown]|             |![][unknown]|
|Edge(Chromium)|![][unknown]|![][unknown] |            |

[gitlab-settings-max-size_github_download_url]: https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-settings-max-size.user.js
[gitlab-settings-max-size_github-last-update]: https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=gitlab-settings-max-size.user.js&style=flat&label=Last%20Update

### Change Gitlab Font

[Top](#monkey-scripts)

#### Install Addresses

[Github][gitlab-font-family_github_download_url]

#### Description

![GitHub last commit][gitlab-font-family_github-last-update]

Replace the font family in the merge request page

#### Compatibility

|              |TamperMonkey|ViolentMonkey|Userscripts |
|--            |--          |--           |--          |
|Chrome        |![][pass]   |![][unknown] |            |
|Firefox       |![][unknown]|![][unknown] |            |
|Safari        |![][unknown]|             |![][unknown]|
|Safari(iOS)   |![][unknown]|             |![][unknown]|
|Edge(Chromium)|![][unknown]|![][unknown] |            |

[gitlab-font-family_github_download_url]: https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.user.js
[gitlab-font-family_github-last-update]: https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=gitlab-font-family.user.js&style=flat&label=Last%20Update

### Enhance UX for the self-managed Gitlab

[Top](#monkey-scripts)

#### Install Addresses

[Github][gitlab-enhance_github_download_url] | [Greasyfork][gitlab-enhance_greasyfork_download_url] | [Openuserjs][gitlab-enhance_openuserjs_download_url]

#### Description

![GitHub last commit][gitlab-enhance_github-last-update]

Enhance some features of the Self-managed Gitlab

#### Compatibility

|              |TamperMonkey|ViolentMonkey|Userscripts |
|--            |--          |--           |--          |
|Chrome        |![][pass]   |![][pass]    |            |
|Firefox       |![][unknown]|![][unknown] |            |
|Safari        |![][unknown]|             |![][unknown]|
|Safari(iOS)   |![][unknown]|             |![][unknown]|
|Edge(Chromium)|![][unknown]|![][unknown] |            |

[gitlab-enhance_github_download_url]: https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-enhance.user.js
[gitlab-enhance_greasyfork_download_url]: https://update.greasyfork.org/scripts/519026/Enhance%20some%20features%20of%20the%20Self-managed%20Gitlab.user.js
[gitlab-enhance_openuserjs_download_url]: https://openuserjs.org/install/arylo/Enhance_some_features_of_the_Self-managed_Gitlab.user.js
[gitlab-enhance_github-last-update]: https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=gitlab-enhance.user.js&style=flat&label=Last%20Update

### Enhance UX for copy manga comic sites

[Top](#monkey-scripts)

#### Install Addresses

[Github][copymanga-enhance_github_download_url]

#### Description

![GitHub last commit][copymanga-enhance_github-last-update]

Enhance UX for copy manga comic page

##### Compatibility

|              |TamperMonkey|ViolentMonkey|Userscripts |
|--            |--          |--           |--          |
|Chrome        |![][pass]   |![][pass]    |            |
|Firefox       |![][unknown]|![][unknown] |            |
|Safari        |![][unknown]|             |![][unknown]|
|Safari(iOS)   |![][unknown]|             |![][unknown]|
|Edge(Chromium)|![][unknown]|![][unknown] |            |

[copymanga-enhance_github_download_url]: https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.user.js
[copymanga-enhance_github-last-update]: https://img.shields.io/github/last-commit/arylo/scripts/monkey?path=copymanga-enhance.user.js&style=flat&label=Last%20Update

[pass]: https://img.shields.io/badge/-pass-green.svg?&logoColor=000&style=for-the-badge&cacheSeconds=7200
[unknown]: https://img.shields.io/badge/-unknown-silver.svg?&logoColor=000&style=for-the-badge&cacheSeconds=7200

## Qinglong Scripts

|Script    |Description                               |
|--        |--                                        |
|groupVideo|Classification and storage for video files|
|moveVideo |Move video files to the target folder     |

## License

[The MIT License.](https://github.com/Arylo/scripts/?tab=MIT-1-ov-file)
