# resolve.imports

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Codecov][codecov-image]][codecov-url]

[Imports] field resolver without file-system reliance.

It uses a new logic differs from [resolve.exports] which also handles:

- [File extensions](#subpath-imports) ([issue in `resolve.exports`][file-extensions-issue])
- [Array patterns](#array-patterns) ([issue in `resolve.exports`][array-patterns-issue])
- [Subpath patterns with file extensions](#subpath-patterns) ([issue in `resolve.exports`][subpath-patterns-issue])

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

Here is the API:

`resolve(pjson: Record, entry: string, options?: { conditions?: string[] }): string | undefined`:

- `pjson` is the package.json object.
- `entry` is the entry to resolve.
- `options` is optional. It contains:
  - `conditions` is the conditions to resolve. It is used for [subpath imports][subpath-imports].

It returns either a `string`, `string[]` (for [array pattern](#array-patterns)) or `undefined`.

Note that it does not support recursive resolution. i.e.:

```ts
import { resolve } from 'resolve.imports';

const pjson = {
  "imports": {
    "#internal/*.js": "#another-internal/*.js",
    "#another-internal/*.js": "./src/another-internal/*.js"
  }
}

resolve(pjson, '#internal/foo.js') //=> undefined
```

It is not supported because I can't find such use case in the spec.
If you have such use case, please open an issue.

### Subpath imports

[Subpath imports][subpath-imports] are supported:

Using [chalk] as an example:

```ts
import { resolve } from 'resolve.imports';

const chalkPackageJson = {
  "imports": {
    "#ansi-styles": "./source/vendor/ansi-styles/index.js",
    "#supports-color": {
      "node": "./source/vendor/supports-color/index.js",
      "default": "./source/vendor/supports-color/browser.js"
    }
  }
}

resolve(chalkPackageJson, '#ansi-styles') //=> `./source/vendor/ansi-styles/index.js`
resolve(chalkPackageJson, '#supports-color') //=> `./source/vendor/supports-color/browser.js`
resolve(chalkPackageJson, '#supports-color', { conditions: ['node'] }) //=> `./source/vendor/supports-color/index.js`
resolve(chalkPackageJson, '#supports-color', { conditions: ['default']}) //=> `./source/vendor/supports-color/browser.js`
```

### File extensions

[File extensions][file-extensions-issue] are supported:

```ts
import { resolve } from 'resolve.imports';

const pjson = {
  imports: {
    '#internal/a.js': './src/internal/a.js',
}

resolve(pjson, '#internal/a.js') //=> `./src/internal/a.js`
```

### Array patterns

```ts
import { resolve } from 'resolve.imports';

const pjson = {
  imports: {
    '#internal/*.js': ['./src/internal/*.js', './src/internal2/*.js']
}

resolve(pjson, '#internal/a.js') //=> ['./src/internal/foo.js', './src/internal2/foo.js']
```

### Subpath patterns

[Subpath patterns][subpath-patterns] are supported:

```ts
import { resolve } from 'resolve.imports';

const pjson = {
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}

resolve(pjson, '#internal/foo.js') //=> `./src/internal/foo.js`
```

### Nested conditions

[Nested conditions](https://nodejs.org/api/packages.html#nested-conditions) are supported:

```ts
import { resolve } from 'resolve.imports';

const pjson = {
  "imports": {
    '#feature': {
      "node": {
        "import": "./feature-node.mjs",
        "require": "./feature-node.cjs"
      },
      "default": "./feature.mjs"
    }
  }
}

resolve(pjson, '#feature') //=> `./feature.mjs`
resolve(pjson, '#feature', { conditions: ['node', 'import']}) //=> `./feature-node.mjs`
```

This is used by [@repobuddy/jest] to resolve ESM packages correctly.

## References

- [WICG-import-maps](https://github.com/WICG/import-maps)
- [import-map-emulation](https://nodejs.org/dist/latest-v17.x/docs/api/policy.html#example-import-maps-emulation)
- [nodejs-modules-support](https://github.com/nodejs/modules/issues/477)
- [@node-loader/import-maps](https://github.com/node-loader/node-loader-import-maps)

[@repobuddy/jest]: https://github.com/repobuddy/jest
[array-patterns-issue]: https://github.com/lukeed/resolve.exports/issues/17
[chalk]: https://github.com/chalk/chalk
[codecov-image]: https://codecov.io/gh/cyberuni/resolve.imports/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/cyberuni/resolve.imports
[downloads-image]: https://img.shields.io/npm/dm/resolve.imports.svg?style=flat
[downloads-url]: https://npmjs.org/package/resolve.imports
[file-extensions-issue]: https://github.com/lukeed/resolve.exports/issues/22
[npm-image]: https://img.shields.io/npm/v/resolve.imports.svg?style=flat
[npm-url]: https://npmjs.org/package/resolve.imports
[subpath-imports]: https://nodejs.org/api/packages.html#subpath-imports
[subpath-patterns-issue]: https://github.com/lukeed/resolve.exports/issues/16
[subpath-patterns]: https://nodejs.org/api/packages.html#subpath-patterns
