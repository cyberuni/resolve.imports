# resolve.imports

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Codecov][codecov-image]][codecov-url]

Resolves files based on the [imports] field within the specified `package.json`.

## Install

```sh
# npm
npm install resolve.imports

# yarn
yarn add resolve.imports

# pnpm
pnpm add resolve.imports

# rush
rush add -p resolve.imports
```

## Usage

```ts
import { resolve } from 'resolve.imports';

// `path = './source/vendored/ansi-styles/index.js'`
const path = resolve(packageJsonContent, '#ansi-styles', { conditions: ['imports', 'node', 'default'] });
```

## References

- [WICG-import-maps](https://github.com/WICG/import-maps)
- [import-map-emulation](https://nodejs.org/dist/latest-v17.x/docs/api/policy.html#example-import-maps-emulation)
- [nodejs-modules-support](https://github.com/nodejs/modules/issues/477)
- [@node-loader/import-maps](https://github.com/node-loader/node-loader-import-maps)

[codecov-image]: https://codecov.io/gh/cyberuni/resolve.imports/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/cyberuni/resolve.imports
[downloads-image]: https://img.shields.io/npm/dm/resolve.imports.svg?style=flat
[downloads-url]: https://npmjs.org/package/resolve.imports
[imports]: https://nodejs.org/api/packages.html#subpath-imports
[npm-image]: https://img.shields.io/npm/v/resolve.imports.svg?style=flat
[npm-url]: https://npmjs.org/package/resolve.imports
