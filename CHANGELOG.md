## [2.0.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v2.0.0...v2.0.1) (2021-03-13)


### Bug Fixes

* initialize outline on initial show ([c4eba08](https://github.com/atom-ide-community/atom-ide-outline/commit/c4eba0866ddabab8ba342b0009e301cb773c810e)), closes [#94](https://github.com/atom-ide-community/atom-ide-outline/issues/94)
* make toggleOutlineView async ([e670161](https://github.com/atom-ide-community/atom-ide-outline/commit/e670161cc195152569094160bd50b8ab06e33094))

# [2.0.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.17.0...v2.0.0) (2021-02-28)


### Performance Improvements

* replace automatic cursor following with a reveal-in-outline command ([78a8bd1](https://github.com/atom-ide-community/atom-ide-outline/commit/78a8bd17133d755781edf371e609ab965a515d25))


### BREAKING CHANGES

* No longer cursor is followed automatically

This is done for performance reasons

# [1.17.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.16.3...v1.17.0) (2021-02-05)


### Bug Fixes

* ad OutlineView.isVisible ([1d13b73](https://github.com/atom-ide-community/atom-ide-outline/commit/1d13b737d4f693838c76527b80fd8472296648ad))
* add back debounce to selectAtCursorLine ([4735a89](https://github.com/atom-ide-community/atom-ide-outline/commit/4735a893c111928c4289be0b7007c73d209707f3))
* check for visibility before selecting the line ([5c54116](https://github.com/atom-ide-community/atom-ide-outline/commit/5c541165ababcd76d49a1886c913bbd1dc285ca5))
* create subscriptions in the global scope ([68136da](https://github.com/atom-ide-community/atom-ide-outline/commit/68136da178e65c32d48eb94c26e94fefea7d4725))
* delay the creation of OutlineView ([98bfa18](https://github.com/atom-ide-community/atom-ide-outline/commit/98bfa18102ac92d8a1a9d754897951572b3c294a))
* make pointToElementsMap a class prop ([0a87965](https://github.com/atom-ide-community/atom-ide-outline/commit/0a879651fd1442f009573e4e58fb0ff4b50324bd))
* make selectAtCursorLine a method so it can use the struct props ([a2b961b](https://github.com/atom-ide-community/atom-ide-outline/commit/a2b961b892955d0152fe026deec23bad1ec1bd97))


### Features

* isItemVisible ([d373ef8](https://github.com/atom-ide-community/atom-ide-outline/commit/d373ef82cd905ae9339ece6a2f5ca97cc5030e3d))
* skip outline calculation if the item is not visible ([71a5216](https://github.com/atom-ide-community/atom-ide-outline/commit/71a52168082929d29e15495dab70561f39607cfa))

## [1.16.3](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.16.2...v1.16.3) (2021-02-04)


### Bug Fixes

* add onlyForFile to busySignal ([876a768](https://github.com/atom-ide-community/atom-ide-outline/commit/876a7688df7e807ca045f812ba60340f9db390e2))
* disable busy signal temporarily ([c5d036c](https://github.com/atom-ide-community/atom-ide-outline/commit/c5d036c75fd4bd63fa749486fff02384b69ccf6d))
* use filePath  in busySignalID ([bbe2bda](https://github.com/atom-ide-community/atom-ide-outline/commit/bbe2bdaf80e135e763758ce6d79c59bf69809187))

## [1.16.2](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.16.1...v1.16.2) (2021-02-04)


### Bug Fixes

* cleaner check editor === undefined ([e9af331](https://github.com/atom-ide-community/atom-ide-outline/commit/e9af3318f9553169fec395cca6ec86ad53b3ddcf))
* direct debouncedSelectAtCursorLine ([9c7a9bc](https://github.com/atom-ide-community/atom-ide-outline/commit/9c7a9bcbc2ccaa2c08072282d1e15446f9bc60e6))
* direct doubouncedGetOutline ([3a7353a](https://github.com/atom-ide-community/atom-ide-outline/commit/3a7353a8d07bc0f684ef5a231eb3b7ac0dc7b209))
* redundant toggleOutlineView callback ([1f8b080](https://github.com/atom-ide-community/atom-ide-outline/commit/1f8b0807425933d53d83b5a1acd5c4e470e08523))

## [1.16.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.16.0...v1.16.1) (2021-02-04)


### Bug Fixes

* make config a json file ([20737f6](https://github.com/atom-ide-community/atom-ide-outline/commit/20737f6ad1b986e0074a1e9b970ea7e808d0d71d))
* only import debounce from lodash ([fad64a2](https://github.com/atom-ide-community/atom-ide-outline/commit/fad64a2955a4ffbfb8cd9da71bed1b203c9f6b3e))
* update deps ([9805350](https://github.com/atom-ide-community/atom-ide-outline/commit/9805350b3b54115bed1b4c081551e4c7ae998248))
* use busySignalProvider.remove ([24826e2](https://github.com/atom-ide-community/atom-ide-outline/commit/24826e21ac79329e1a49a785aafeede46fc9f931))

# [1.16.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.15.5...v1.16.0) (2021-01-08)


### Features

* go into large file mode if the file is minified ([a1ec8ad](https://github.com/atom-ide-community/atom-ide-outline/commit/a1ec8adf5399df4fc0caecdef85ec399e4ec6343))

## [1.15.5](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.15.4...v1.15.5) (2020-12-21)


### Bug Fixes

* trigger release again ([3803da1](https://github.com/atom-ide-community/atom-ide-outline/commit/3803da15d2f0247752405d1b1d49269c249081d9))
* trigger release again ([1ebccae](https://github.com/atom-ide-community/atom-ide-outline/commit/1ebccae19e1875b7da7c7867a0651c6810cb94be))

## [1.15.4](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.15.3...v1.15.4) (2020-12-21)


### Bug Fixes

* on cursor move scroll until the entry is in the center of outline ([9bdac23](https://github.com/atom-ide-community/atom-ide-outline/commit/9bdac23f7aaf466fa17fc9baf133912a9226ac04))

## [1.15.3](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.15.2...v1.15.3) (2020-12-21)


### Bug Fixes

* do not scroll outline entries when it is clicked on one ([3be0a19](https://github.com/atom-ide-community/atom-ide-outline/commit/3be0a196773c30697582fd1136829c59a0ac786f))

## [1.15.2](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.15.1...v1.15.2) (2020-12-11)


### Bug Fixes

* all the entries had fold buttons ([38ccf8a](https://github.com/atom-ide-community/atom-ide-outline/commit/38ccf8a1731a27314d2a2a0cd7410ec194a80c0a))
* cursor following was broken in the previous release ([f840f43](https://github.com/atom-ide-community/atom-ide-outline/commit/f840f43af5780ddc6292ed10819123f73d897081))

## [1.15.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.15.0...v1.15.1) (2020-12-10)


### Bug Fixes

* addOutlineEntries: replace object with normal function arguments ([e9511ef](https://github.com/atom-ide-community/atom-ide-outline/commit/e9511ef9941134404623839c6f03752bf7b159aa))
* fuse ifs and inline hasChildren ([0843a27](https://github.com/atom-ide-community/atom-ide-outline/commit/0843a272fde964642cd313edf83d96d030a610a1))
* inline unused variables ([3a84f8f](https://github.com/atom-ide-community/atom-ide-outline/commit/3a84f8f8ec442a8af213f898e2358efad86ae97c))
* only pass newBufferPosition ([dff2f73](https://github.com/atom-ide-community/atom-ide-outline/commit/dff2f73dce382911a88ddca425c8340c0851f08d))
* refactor clearOutline ([271e315](https://github.com/atom-ide-community/atom-ide-outline/commit/271e315c5eff5ce95a8e69b6972a0e6be0a9dbb6))
* replace append with appendChild ([37aa9f7](https://github.com/atom-ide-community/atom-ide-outline/commit/37aa9f785752702c823bd98cdb75445d66230a11))
* replace forEach with for of ([ff7e3de](https://github.com/atom-ide-community/atom-ide-outline/commit/ff7e3de693c92fe34cfde054f6fc680760783119))
* setOutline: replace object with normal function arguments ([7e19c02](https://github.com/atom-ide-community/atom-ide-outline/commit/7e19c02c771bf803b11a323d2300a30304f3b4be))

# [1.15.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.14.1...v1.15.0) (2020-12-10)


### Bug Fixes

* add css containment to all selectors ([1624082](https://github.com/atom-ide-community/atom-ide-outline/commit/16240826460687f543964f7f73ffaf4d2c369b07))
* remove excess return in getIcon ([b390641](https://github.com/atom-ide-community/atom-ide-outline/commit/b39064185de465618b378df14b10926014fbe5f6))


### Features

* add foldInitially option ([d57b026](https://github.com/atom-ide-community/atom-ide-outline/commit/d57b0262fde955ddcbe6dc8318eb1c66849ac56c))

## [1.14.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.14.0...v1.14.1) (2020-12-08)


### Bug Fixes

* updateDebounceTime: use max instead of min ([1b12606](https://github.com/atom-ide-community/atom-ide-outline/commit/1b1260645cf9712a87dc7726a57389876dd495f1))

# [1.14.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.13.0...v1.14.0) (2020-12-07)


### Bug Fixes

* make event listeners passive ([da37db0](https://github.com/atom-ide-community/atom-ide-outline/commit/da37db0b74756c625c6be87c76554cd590908052))
* make large file mode update rate slower ([0ea2652](https://github.com/atom-ide-community/atom-ide-outline/commit/0ea26523819d1a0cbd5d3a45e914a162c2ba64fd))
* make updateDebounceTime editor's size dependant ([4c452a3](https://github.com/atom-ide-community/atom-ide-outline/commit/4c452a3cd02419120a0d6b717974c0bc8e03825b))
* remove updateDebounceTime config ([9dc937a](https://github.com/atom-ide-community/atom-ide-outline/commit/9dc937a6a91c820421d7572193433150a2954533))


### Features

* add large file mode notificaiton ([ebe5a07](https://github.com/atom-ide-community/atom-ide-outline/commit/ebe5a07eb55111f6c64f51e0925b810c7f649e6a))
* fold initially in large files ([3252809](https://github.com/atom-ide-community/atom-ide-outline/commit/3252809e9983f69e6216c32a7157d8d82249179d))
* skip following cursor in large files ([fd1b326](https://github.com/atom-ide-community/atom-ide-outline/commit/fd1b326bf1a5f29465ec5429225f8b2121991d5d))

# [1.13.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.12.1...v1.13.0) (2020-12-07)


### Bug Fixes

* adjust font size and width ([4ec9557](https://github.com/atom-ide-community/atom-ide-outline/commit/4ec9557be658d462e37199229309e5a133a87f43))
* escape symbols using \ue ([a11e9e7](https://github.com/atom-ide-community/atom-ide-outline/commit/a11e9e72a1780dde7dbe3bbba9965c4c04cea425))
* increase the width of the icon ([53c1959](https://github.com/atom-ide-community/atom-ide-outline/commit/53c195978c37fc538964dec45c021d1f3da15e5f))
* use Map and disable less intuitive icons ([77cbc97](https://github.com/atom-ide-community/atom-ide-outline/commit/77cbc9782ee863bc8e1ab5ea69bd0350b76d79b0))
* use pkg for package [skip ci] ([d00eef0](https://github.com/atom-ide-community/atom-ide-outline/commit/d00eef0a2fa3095d1a3cea2b21ac0936a3611635))


### Features

* add abbreviationMap ([48a6052](https://github.com/atom-ide-community/atom-ide-outline/commit/48a6052de5741a72aad73015240974fd4cfeae62))
* add fonts ([38ccfd7](https://github.com/atom-ide-community/atom-ide-outline/commit/38ccfd7fa434fc12a17ce274540256e9f75b19a5))
* add symbol map ([5aeef4c](https://github.com/atom-ide-community/atom-ide-outline/commit/5aeef4c800ee56fe7aa70656cd18e36c50e95bb1))
* make icon from symbol or abbreviation ([a1190a9](https://github.com/atom-ide-community/atom-ide-outline/commit/a1190a9eba68c9603b1cf5ea41c0d200bcd5d83b))

## [1.12.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.12.0...v1.12.1) (2020-10-26)


### Bug Fixes

* bump ([d07b4a2](https://github.com/atom-ide-community/atom-ide-outline/commit/d07b4a2f6ffea1dc345a55151507d9e351b4a3b3))

# [1.12.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.11.2...v1.12.0) (2020-10-25)


### Features

* add updateDebounceTime: ([f499fc4](https://github.com/atom-ide-community/atom-ide-outline/commit/f499fc4954bb70a5fee41eda37081bd674ff3062))
* install lodash ([5706ac6](https://github.com/atom-ide-community/atom-ide-outline/commit/5706ac62656424c8e317b26e5efb648af499b2a0))

## [1.11.2](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.11.1...v1.11.2) (2020-10-14)


### Bug Fixes

* increase indentRatio ([1462f69](https://github.com/atom-ide-community/atom-ide-outline/commit/1462f69aa3c8b8d48ecd40576ebb88b5bc6e4dc5))

## [1.11.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.11.0...v1.11.1) (2020-10-14)


### Bug Fixes

* css containment. ([e862983](https://github.com/atom-ide-community/atom-ide-outline/commit/e8629833bfd4aa4ab286d7fe1ab9cef385c2d1d0))

# [1.11.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.10.1...v1.11.0) (2020-10-04)


### Bug Fixes

* fix busy signal types ([1aa7eee](https://github.com/atom-ide-community/atom-ide-outline/commit/1aa7eeeb4fd1211722e13360689e84ad80d00095))
* remove unused imports ([5919e3f](https://github.com/atom-ide-community/atom-ide-outline/commit/5919e3f6cfa317c1d837c263952d3ec3728162f5))
* update the list of ides ([d1b174b](https://github.com/atom-ide-community/atom-ide-outline/commit/d1b174bf8fd9133f90221000e5596db61da79c0e))
* use optional chaining to setOutline ([693e9d4](https://github.com/atom-ide-community/atom-ide-outline/commit/693e9d49d01218025410c8bfd93d738f38b54a46))


### Features

* atom-ide-base 1.6.1 ([284a7b0](https://github.com/atom-ide-community/atom-ide-outline/commit/284a7b0c25bcdd47e53cac4874eb7d2731d63450))
* fix the OutlineTree types ([7848113](https://github.com/atom-ide-community/atom-ide-outline/commit/7848113dd0366226725622db61485640cb30c76d))
* install atom-ide-base ([11a3f2f](https://github.com/atom-ide-community/atom-ide-outline/commit/11a3f2f4b61d417e3d55be8aa55923078b22e6f2))
* use ProviderRegistry from atom-ide-base ([1cbff48](https://github.com/atom-ide-community/atom-ide-outline/commit/1cbff483571c1c47f9d1c449cd326742cca107ac))

## [1.10.1](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.10.0...v1.10.1) (2020-09-08)


### Bug Fixes

* format ([a9cdb65](https://github.com/atom-ide-community/atom-ide-outline/commit/a9cdb65a41bcd70d662cda4ab20d0c139462d00a))

# [1.10.0](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.9.5...v1.10.0) (2020-09-08)


### Bug Fixes

* replace expanded and collapsed buttons ([70999f5](https://github.com/atom-ide-community/atom-ide-outline/commit/70999f51bc0bb53010a05872ed88b7aacfa54698))


### Features

* set the opacity of the fold button to 1 ([650c41b](https://github.com/atom-ide-community/atom-ide-outline/commit/650c41bedc57798a42a64802942e941f0e3d109f))
* update preview ([2c6f159](https://github.com/atom-ide-community/atom-ide-outline/commit/2c6f159d6839e66fe2fa42d11de23bf166daddcb))

## [1.9.5](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.9.4...v1.9.5) (2020-08-12)


### Bug Fixes

* bump ([7b48359](https://github.com/atom-ide-community/atom-ide-outline/commit/7b48359b1c79130ad47b30cf1f611b9fac494354))

## [1.9.4](https://github.com/atom-ide-community/atom-ide-outline/compare/v1.9.3...v1.9.4) (2020-07-25)

### Bug Fixes

- tabLength fix ([ad11a35](https://github.com/atom-ide-community/atom-ide-outline/commit/ad11a35ec34977cee57f6850a3272401dcf2e9eb))

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
