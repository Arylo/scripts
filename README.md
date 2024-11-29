# Scripts for Arylo

[![GitHub license](https://img.shields.io/github/license/arylo/scripts.svg?style=flat-square&logo=github&cacheSecond=3600)](https://github.com/arylo/scripts/)

This project contains scripts that are useful for Arylo's daily tasks.

## Monkey Scripts

|Script                      |Description                                        |Install                                                                  |
|--                          |--                                                 |--                                                                       |
|gitlab-font-family          |Replace the font family in the merge request page  |[Github][gitlab-font-family_github]                                      |
|~~gitlab-settings-max-size~~|~~Expand the page size in the CI/CD settings page~~|~~[Github][gitlab-settings-max-size_github]~~                            |
|gitlab-enhance              |Enhance some features of the Self-managed Gitlab   |[GreasyFork][gitlab-enhance_greasyfork] \|[Github][gitlab-enhance_github]|
|nyaa-si-show-image          |In some scenarios show image on the `nyaa.si`      |[Github][nyaa-si-show-image_github]                                      |
|copymanga-enhance           |Enhance UX for copy manga comic page               |[Github][copymanga-enhance_github]                                       |

[gitlab-font-family_github]: https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-font-family.user.js
[gitlab-settings-max-size_github]: https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-settings-max-size.user.js
[gitlab-enhance_greasyfork]: https://update.greasyfork.org/scripts/519026/Enhance%20some%20features%20of%20the%20Self-managed%20Gitlab.user.js
[gitlab-enhance_github]: https://raw.githubusercontent.com/Arylo/scripts/monkey/gitlab-enhance.user.js
[nyaa-si-show-image_github]: https://raw.githubusercontent.com/Arylo/scripts/monkey/nyaa-si-show-image.user.js
[copymanga-enhance_github]: https://raw.githubusercontent.com/Arylo/scripts/monkey/copymanga-enhance.user.js

### Compatibility

|Script                      |Chrome                |Firefox|Safari|Safari(iOS)|Edge(Chromium)|
|--                          |--                    |--     |--    |--         |--            |
|gitlab-font-family          |![][tampermonkey_pass]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|
|~~gitlab-settings-max-size~~|![][tampermonkey_pass]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|
|gitlab-enhance              |![][tampermonkey_pass]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|
|nyaa-si-show-image          |![][tampermonkey_pass]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|
|copymanga-enhance           |![][tampermonkey_pass]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|![][tampermonkey_unknown]|

[tampermonkey_pass]: https://img.shields.io/badge/-pass-green.svg?logo=tampermonkey&logoColor=000&style=for-the-badge&cacheSeconds=3600
[tampermonkey_unknown]: https://img.shields.io/badge/-unknown-silver.svg?logo=tampermonkey&logoColor=000&style=for-the-badge&cacheSeconds=3600

## Qinglong Scripts

|Script    |Description                               |
|--        |--                                        |
|groupVideo|Classification and storage for video files|
|moveVideo |Move video files to the target folder     |

## License

[The MIT License.](https://github.com/Arylo/scripts/?tab=MIT-1-ov-file)
