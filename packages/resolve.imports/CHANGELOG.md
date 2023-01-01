# resolve.imports

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
