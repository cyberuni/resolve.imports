# resolve.imports

## 2.0.3

### Patch Changes

- cde5df7: Add missing slash in error message

## 2.0.2

### Patch Changes

- b4d6e0c: Fix array pattern handling.

  The array pattern actually does not return an array of resolved paths.
  It returns the first match with condition support.

  i.e.:

  ```ts
  //=> "./a.js"
  {
    "imports": {
      "#a": ["./a.js", "./b.js"]
    }
  }

  // `conditions: ["node"] => "./node.js"`
  // `conditions: undefined => "./browser.js"`
  {
    "imports": {
      "#a": [
        { "node": "./node.js" },
        "./browser.js"
      ]
    }
  }
  ```

## 2.0.1

### Patch Changes

- 691671b: Ignore `conditions` order.

  The implementation in Node.js is not order-sensitive, so we should not be either.

## 2.0.0

### Major Changes

- e0c6e74: Throwing errors as in Node.js implementation.

  The API have changed to receive a manifest object so that it can throw errors as in Node.js.

### Patch Changes

- Updated dependencies [392cf7c]
  - pattern-key-compare@2.0.0

## 1.2.7

### Patch Changes

- 1cb455e: Filter out non expensionKeys.
  This does not affect the behavior of the package.
  Just that it match closer to the spec.

  Even if the non expensionKeys are not filtered,
  the behavior is the same.
  It's actually not sure if doing a filter first is faster or not.

## 1.2.6

### Patch Changes

- b137fa2: Extract `patternKeyCompare` to `pattern-key-compare` package.
- 71f87b3: Add `ts` folder to distribution.
  It is needed for `declarationMap` to work.

  Remove extra typing files in `cjs` folder.

- Updated dependencies [b137fa2]
  - pattern-key-compare@1.0.0

## 1.2.5

### Patch Changes

- 1d87f1c: Remove `slice()`. It is not needed.

## 1.2.4

### Patch Changes

- 5b742f7: Support sording expensionKeys.

  See `PATTERN_KEY_COMPARE` in https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification for more information.

- 9368d41: Returns `undefined` if specifier is exactly `#` or `#/`.
- e358b6d: Return `undefined` if the import is recursive.

  The spec does not support recursion: https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification

## 1.2.3

### Patch Changes

- 9c4e428: Fix straight match with conditions.

## 1.2.2

### Patch Changes

- 81a3d57: handles multiple \*

## 1.2.1

### Patch Changes

- 17fed45: add types and JSDoc
- 4cfc680: Fix handling of trailing `*` pattern

## 1.2.0

### Minor Changes

- f5313ab: Handles array form

## 1.1.0

### Minor Changes

- 8c13b9f: Support `subpath patterns` and `nested conditions`

## 1.0.1

### Patch Changes

- 67ca22b: Handle string value
- 694b57c: accept `options` without `conditions` prop
