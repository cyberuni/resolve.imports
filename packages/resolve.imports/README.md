# resolve.imports

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Codecov][codecov-image]][codecov-url]

[Imports][subpath-imports] field resolver without file-system reliance.

It tracks closely with the implementation in [Node.js][nodejs-implementation].

This is used by [@repobuddy/jest] to resolve ESM packages correctly.

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

```ts
resolve(
  manifest: ImportsFieldManifest,
  specifier: string,
  options?: { conditions?: string[] }
): string | string[] | undefined
```

- `manifest` is the `package.json` manifest to resolve the specifier from. It contains:
  - `content` is the `package.json` content.
  - `path` is the optional `package.json` path. Used for error handling only.
  - `base` is the optional base path of the import. Used for error handling only.
- `specifier` is the entry to resolve.
- `options` is optional. It contains:
  - `conditions` is the conditions to resolve. Supports [nested conditions](#nested-conditions).

It returns either a `string`, `string[]` (for [array patterns](#array-patterns)) or `undefined`.

### Subpath imports

[Subpath imports][subpath-imports] are supported (the main purpose of this package):

Using [chalk] as an example:

```ts
import { resolve } from 'resolve.imports';

const manifest = {
  content: {
    "imports": {
      "#ansi-styles": "./source/vendor/ansi-styles/index.js",
      "#supports-color": {
        "node": "./source/vendor/supports-color/index.js",
        "default": "./source/vendor/supports-color/browser.js"
      }
    }
  },
  // optional
  path: './node_modules/chalk/',
  base: '<cwd>'
}

//=> `./source/vendor/ansi-styles/index.js`
resolve(manifest, '#ansi-styles')

//=> `./source/vendor/supports-color/browser.js`
resolve(manifest, '#supports-color')

//=> `./source/vendor/supports-color/index.js`
resolve(manifest, '#supports-color', { conditions: ['node'] })

//=> `./source/vendor/supports-color/browser.js`
resolve(manifest, '#supports-color', { conditions: ['default'] })
```

### File extensions

[File extensions][file-extensions-issue] are supported:

```ts
import { resolve } from 'resolve.imports';

const manifest = {
  content: {
    imports: {
      '#internal/a.js': './src/internal/a.js'
    }
  }
}


//=> `./src/internal/a.js`
resolve(manifest, '#internal/a.js')
```

### Array patterns

```ts
import { resolve } from 'resolve.imports';

const manifest = {
  content: {
    imports: {
      '#internal/*.js': ['./src/internal/*.js', './src/internal2/*.js']
    }
  }
}

//=> ['./src/internal/foo.js', './src/internal2/foo.js']
resolve(manifest, '#internal/a.js')
```

### Subpath patterns

[Subpath patterns][subpath-patterns] are supported:

```ts
import { resolve } from 'resolve.imports';

const manifest = {
  content: {
    "imports": {
      "#internal/*.js": "./src/internal/*.js"
    }
  }
}

//=> `./src/internal/foo.js`
resolve(manifest, '#internal/foo.js')
```

### Nested conditions

[Nested conditions](https://nodejs.org/api/packages.html#nested-conditions) are supported:

```ts
import { resolve } from 'resolve.imports';

const manifest = {
  content: {
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
}

//=> `./feature.mjs`
resolve(manifest, '#feature')

//=> `./feature-node.mjs`
resolve(manifest, '#feature', { conditions: ['node', 'import']})
```

### Recursive imports

Resolving recursive imports is **not** supported.
i.e. the following does **not** work:

```ts
import { resolve } from 'resolve.imports';

const manifest = {
  content: {
    "imports": {
      "#internal/*.js": "#another-internal/*.js",
      "#another-internal/*.js": "./src/path/*.js"
    }
  }
}

//=> undefined
resolve(manifest, '#internal/foo.js')
```

It is not supported because the spec does not support it.
See [resolver algorithm][resolver-algorithm] for more information.

## Resolve Algorithm Specification

This module tries to follow the [resolver algorithm][resolver-algorithm] as much as possible.

However, the spec describes the internal functions implementation instead of the abstract behavior.
So some of the spec does not apply to this module.

Here are the key notes:

- asserts are not checked, as this module needs to return `undefined` for other cases.
- errors are not thrown, as the errors in the spec are internal to Node.js. `undefined` is returned instead.

### `PACKAGE_IMPORTS_RESOLVE`

```md
1. Assert: specifier begins with "#". // return `undefined`
2. If specifier is exactly equal to "#" or starts with "#/", then
  1. Throw an Invalid Module Specifier error. // return `undefined`
5. Throw a Package Import Not Defined error. // out of scope
```

### `PACKAGE_TARGET_RESOLVE`

> Return PACKAGE_RESOLVE(target with every instance of "*" replaced by patternMatch, packageURL + "/").

The phrase `target with every instance of "*" replaced by patternMatch` indicates it can contain multiple `*`s.
This module supports multiple `*`s in the replacer pattern as described,
but it is likely a bug in the spec, as the resulting string likely does not make sense.

## References

- [NodeJS resolver algorithm][resolver-algorithm]
- [WICG-import-maps](https://github.com/WICG/import-maps)
- [import-map-emulation](https://nodejs.org/dist/latest-v17.x/docs/api/policy.html#example-import-maps-emulation)
- [nodejs-modules-support](https://github.com/nodejs/modules/issues/477)
- [@node-loader/import-maps](https://github.com/node-loader/node-loader-import-maps)

[@repobuddy/jest]: https://github.com/repobuddy/jest
[chalk]: https://github.com/chalk/chalk
[codecov-image]: https://codecov.io/gh/cyberuni/resolve.imports/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/cyberuni/resolve.imports
[downloads-image]: https://img.shields.io/npm/dm/resolve.imports.svg?style=flat
[downloads-url]: https://npmjs.org/package/resolve.imports
[file-extensions-issue]: https://github.com/lukeed/resolve.exports/issues/22
[nodejs-implementation]: https://github.com/nodejs/node/blob/6d49f46b48be969befff98bf5b38339df3c06c19/lib/internal/modules/esm/resolve.js#L625
[npm-image]: https://img.shields.io/npm/v/resolve.imports.svg?style=flat
[npm-url]: https://npmjs.org/package/resolve.imports
[resolver-algorithm]: https://nodejs.org/api/esm.html#resolver-algorithm-specification
[subpath-imports]: https://nodejs.org/api/packages.html#subpath-imports
[subpath-patterns]: https://nodejs.org/api/packages.html#subpath-patterns
