## [1.9.3](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.9.2...v1.9.3) (2020-07-25)

### Bug Fixes

- correct compensation for foldButtonWidth ([0298d12](https://github.com/atom-ide-community/atom-ide-outline/commit/0298d1234359332d3ea27e598894041fc606041f))
- set default indentRatio to 24 ([a9b2836](https://github.com/atom-ide-community/atom-ide-outline/commit/a9b28363ead97c74ac43e54f1ae6621218d7cf5c))
- use 0 px for parents with level 0 ([5e50ace](https://github.com/atom-ide-community/atom-ide-outline/commit/5e50acea097bc9a4b7d214ace5f6054b7ae7e491))
- use tabLength to determine the indentLength ([43cb28e](https://github.com/atom-ide-community/atom-ide-outline/commit/43cb28ef654e7b575438b064654cec50c767b45e))

## [1.9.2](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.9.1...v1.9.2) (2020-07-25)

### Bug Fixes

- disable unused level ([46ab6c0](https://github.com/atom-ide-community/atom-ide-outline/commit/46ab6c0035958ebc7f37ab9b272abfecf78ac957))
- use CompositeDisposable ([12ea6f1](https://github.com/atom-ide-community/atom-ide-outline/commit/12ea6f1ce21106fbd47e0c3b02ac7fd5357d72dd))

## [1.9.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.9.0...v1.9.1) (2020-07-25)

### Bug Fixes

- disposable leak fix ([dd70b30](https://github.com/atom-ide-community/atom-ide-outline/commit/dd70b30f02bfb6c89026331ae5bdcd7599cc0918))

# [1.9.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.8.1...v1.9.0) (2020-07-25)

### Features

- sort entries based on the line number ([e23e26b](https://github.com/atom-ide-community/atom-ide-outline/commit/e23e26bfe6c75e7343bb3b881ac8ed519b13ee7e))

## [1.8.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.8.0...v1.8.1) (2020-07-24)

### Bug Fixes

- always scroll to itself ([fbed5d2](https://github.com/atom-ide-community/atom-ide-outline/commit/fbed5d2553f6e6bc01de6992a382204dac18d18a))

# [1.8.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.7.0...v1.8.0) (2020-07-23)

### Features

- add selectAtCursorLine callback to the observer ([505b884](https://github.com/atom-ide-community/atom-ide-outline/commit/505b88403ac2200e93fae6d42e5215d81e81a948))
- callback for scrolling and highlighting the element that the cursor is on ([850ce49](https://github.com/atom-ide-community/atom-ide-outline/commit/850ce49f9bc340613fa1ded6cc0bc1cff999b8ff))
- CSS highlight when the editor cursor is on them ([cc268e2](https://github.com/atom-ide-community/atom-ide-outline/commit/cc268e221dd97d1d0730e61c0d309b06a14a008d))
- PointToElementsMap ([c03e4c6](https://github.com/atom-ide-community/atom-ide-outline/commit/c03e4c6e1127483eb95ce2e6f0f8a29d09066bbb))
- scroll to element or its parent ([569545d](https://github.com/atom-ide-community/atom-ide-outline/commit/569545d1d1b16b28d8b6d1d262c39767bee9abf8))
- store level in the element as an attribute ([faa779c](https://github.com/atom-ide-community/atom-ide-outline/commit/faa779c286a64027244acd89d207a3c62d85a403))
- update the preview ([1bf8d69](https://github.com/atom-ide-community/atom-ide-outline/commit/1bf8d69f292ced5abdef79d61d9b95235dfdb680))

# [1.7.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.6.3...v1.7.0) (2020-07-23)

### Features

- change fold button opacity based on focus ([6cd1fe9](https://github.com/atom-ide-community/atom-ide-outline/commit/6cd1fe984a296fcf3ab2eb55e63b27ac895f7ce8))
- darker color for fold buttons ([6e0bc91](https://github.com/atom-ide-community/atom-ide-outline/commit/6e0bc9101234cc29abbb510f464d2bbcc9683295))

## [1.6.3](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.6.2...v1.6.3) (2020-07-23)

### Bug Fixes

- clean up if the editor is closed ([1ae25a3](https://github.com/atom-ide-community/atom-ide-outline/commit/1ae25a325e1d901c32c49f4bfd419cfe1c96900d))

## [1.6.2](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.6.1...v1.6.2) (2020-07-21)

### Bug Fixes

- indent when level is 0 ([197495c](https://github.com/atom-ide-community/atom-ide-outline/commit/197495c8579d05ade88eea3416955a68452885f8))

## [1.6.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.6.0...v1.6.1) (2020-07-21)

### Bug Fixes

- detect given API automatically ([29b8ff5](https://github.com/atom-ide-community/atom-ide-outline/commit/29b8ff5299848684d0f00f91fd2ab40de9871db6))

# [1.6.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.5.1...v1.6.0) (2020-07-21)

### Features

- fold button ([6016cd8](https://github.com/atom-ide-community/atom-ide-outline/commit/6016cd8c7c8ef33a4e424467d3bac205a2cfc55c))
- fold class ([028256a](https://github.com/atom-ide-community/atom-ide-outline/commit/028256af9c25b0d075d85315498c4d084b9342c2))
- padding based on having a child ([fadc7d6](https://github.com/atom-ide-community/atom-ide-outline/commit/fadc7d6558a97a52eb3200385e0df9c26f67f4e1))
- return kindClass ([9d67893](https://github.com/atom-ide-community/atom-ide-outline/commit/9d67893153d7f6e541326eb55b733d348118483e))
- styleByType for all classes ([a732e26](https://github.com/atom-ide-community/atom-ide-outline/commit/a732e26afa2ebeb0159e596778cbe6b1a42102b6))
- update screenshot ([80b12de](https://github.com/atom-ide-community/atom-ide-outline/commit/80b12de9a11eab75160dddd1fb4d80aa6fb399e2))

## [1.5.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.5.0...v1.5.1) (2020-07-21)

### Bug Fixes

- use same font and size of the editor ([b041a3d](https://github.com/atom-ide-community/atom-ide-outline/commit/b041a3d28b99b1a370e690da0341028389657da1))

# [1.5.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.4.0...v1.5.0) (2020-07-20)

### Bug Fixes

- larget outline entries ([bea7f98](https://github.com/atom-ide-community/atom-ide-outline/commit/bea7f9803e5fda76c0daed3097ddb45cba54d888))

### Features

- InitialDisplay config ([91beb00](https://github.com/atom-ide-community/atom-ide-outline/commit/91beb0080e5205d5420b3b9ba20bb91413f87ba2))
- show outline initially ([82fa270](https://github.com/atom-ide-community/atom-ide-outline/commit/82fa2708cb31c04739ef9cd953b0d064b55fec92))

## [1.4.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.4.0...v1.4.1) (2020-07-20)

### Bug Fixes

- larget outline entries ([bea7f98](https://github.com/atom-ide-community/atom-ide-outline/commit/bea7f9803e5fda76c0daed3097ddb45cba54d888))

# [1.4.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.3.1...v1.4.0) (2020-07-20)

### Features

- accept both kind and icon ([9fd1a0e](https://github.com/atom-ide-community/atom-ide-outline/commit/9fd1a0ecd7c7843918447923bafbaa7a70f6de29))
- accept icon or kind as the icon API ([11eecfd](https://github.com/atom-ide-community/atom-ide-outline/commit/11eecfdea8ebe72e30a6c5ca61424885ae5c6548))
- accept iconType supplied with/without "type-" ([f223ba2](https://github.com/atom-ide-community/atom-ide-outline/commit/f223ba2b2efe084ef379aaa1f9873a6e92b4fd60))
- plainText support ([d8f79ed](https://github.com/atom-ide-community/atom-ide-outline/commit/d8f79edc1c8817dc4ae2905b9bfd1940e5884ea2))

## [1.3.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.3.0...v1.3.1) (2020-07-11)

### Bug Fixes

- remove icon height rule ([937c647](https://github.com/atom-ide-community/atom-ide-outline/commit/937c647cf3096cbf416396ce6f66d5dc3cb813b1))
- Remove outline-view display, flex-drection, height, width: ([2274262](https://github.com/atom-ide-community/atom-ide-outline/commit/227426205a97c669bf794bbcd5301231b0ef4399))
- remove outline-view font rules ([1a4dc00](https://github.com/atom-ide-community/atom-ide-outline/commit/1a4dc009410ffa9f1783ec8ef59561c5dc9a4907))

# [1.3.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.2.4...v1.3.0) (2020-07-05)

### Features

- add babel config ([8e9e9bd](https://github.com/atom-ide-community/atom-ide-outline/commit/8e9e9bded85a9917afcb083c0d754544dcb44116))
- add git config ([0dac181](https://github.com/atom-ide-community/atom-ide-outline/commit/0dac181fad625ecda02a064c1da56a047893b121))
- add lint and format config ([93a3dfc](https://github.com/atom-ide-community/atom-ide-outline/commit/93a3dfc6c3a02cea9e837d936c37ac8e6da1e58e))
- add rollup config ([e1a1d44](https://github.com/atom-ide-community/atom-ide-outline/commit/e1a1d448a1a6eb0a0e9bf90aad6c7faed44d5beb))
- async consumeOutlineProvider ([db3c179](https://github.com/atom-ide-community/atom-ide-outline/commit/db3c1790fa27dff6449faa8d1925037ed5fbbbb7))
- dev dependencies ([e822e99](https://github.com/atom-ide-community/atom-ide-outline/commit/e822e9991c89a9acdec2f6f9a5bb7d5a431420fb))
- export functions directly ([03af865](https://github.com/atom-ide-community/atom-ide-outline/commit/03af8659ddd7deda997fb58fc9b63b59b4ebb84e))
- export statuses for spec ([019087b](https://github.com/atom-ide-community/atom-ide-outline/commit/019087bcda7702d67a6adfb60641190f38b09095))
- npm run bump ([8e35d43](https://github.com/atom-ide-community/atom-ide-outline/commit/8e35d430a5bea5b02d4c9cba2131736f698e6ed3))
- observer enhancement ([d6e7982](https://github.com/atom-ide-community/atom-ide-outline/commit/d6e798265519c1e1491c19ba3cad2271c35f5f47))
- optional chaining for editor.onDidSave ([d220fbf](https://github.com/atom-ide-community/atom-ide-outline/commit/d220fbf3998b7246f469b90058506727d0ccfb02))
- remove use babel in src ([ae59d14](https://github.com/atom-ide-community/atom-ide-outline/commit/ae59d143e724128fe735e35a8d7de2be2cbbef67))
- rename lib to src + test from dist ([c128d1a](https://github.com/atom-ide-community/atom-ide-outline/commit/c128d1a3e21eece55f3289ee3d10117992a8a342))
- scripts ([2902413](https://github.com/atom-ide-community/atom-ide-outline/commit/29024135193259671d2cff3e7367397907ebf55b))
- update noEditor description ([c69c4bb](https://github.com/atom-ide-community/atom-ide-outline/commit/c69c4bb95d6993d053c2deeae392020ce53fe61e))
- update package-lock ([c21a677](https://github.com/atom-ide-community/atom-ide-outline/commit/c21a677f95e00a509cbd6148d54470d6804c4408))
- use optional chaining for disposing ([559be73](https://github.com/atom-ide-community/atom-ide-outline/commit/559be7390767735a79b155300f916a4a17464255))

## [1.2.4](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.2.3...v1.2.4) (2020-04-17)

### Bug Fixes

- entry with missing icon breaking outline generation ([479a422](https://github.com/atom-ide-community/atom-ide-outline/commit/479a422580f96c8772fe00e813834d77952862b0))

## [1.2.3](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.2.2...v1.2.3) (2020-04-15)

### Bug Fixes

- activation hook to improve the loading time by deferring it ([b5125a9](https://github.com/atom-ide-community/atom-ide-outline/commit/b5125a90039e55ee2cfeb23272bf72434df79d74))
- full activation in spec ([98cd86e](https://github.com/atom-ide-community/atom-ide-outline/commit/98cd86e0f4c99640b65cb9773af8b910f3cf20e0))
- package activation ([52bd1bb](https://github.com/atom-ide-community/atom-ide-outline/commit/52bd1bb107dd593028079ca302ecd39825dfef09))

## [1.2.2](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.2.1...v1.2.2) (2020-04-13)

### Bug Fixes

- don't set busy signal if no provider is available ([a304686](https://github.com/atom-ide-community/atom-ide-outline/commit/a3046869b916191a8ca762831cfdb2c11a71eac8))

## [1.2.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.2.0...v1.2.1) (2020-04-11)

### Bug Fixes

- follow ui theme's font size setting ([774ea61](https://github.com/atom-ide-community/atom-ide-outline/commit/774ea6164c5bd966e86bc0da182a7a90be5bbe5e))

# [1.2.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.1.1...v1.2.0) (2020-04-02)

### Features

- add outline status ([fec774f](https://github.com/atom-ide-community/atom-ide-outline/commit/fec774f483e969c18167f8b70615d9de6ea88b90))

## [1.1.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.1.0...v1.1.1) (2020-03-19)

### Bug Fixes

- on-save setup failing if editor is unavailable ([9ae6109](https://github.com/atom-ide-community/atom-ide-outline/commit/9ae6109df00ba141b5730b93194d38c7266ff361))

# [1.1.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.0.0...v1.1.0) (2020-03-18)

### Features

- add outline update on save ([5578403](https://github.com/atom-ide-community/atom-ide-outline/commit/55784037bfa60a746c9f9bf03d4f4f02b2ca5805))

# 1.0.0 (2020-03-15)

### Features

- initial release ([36d8407](https://github.com/atom-ide-community/atom-ide-outline/commit/36d8407e4a882ede41335e8872a063f0aadd20fa))
