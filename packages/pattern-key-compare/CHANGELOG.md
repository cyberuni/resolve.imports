# pattern-key-compare

## 2.0.1

### Patch Changes

- 307158d: Upgrade `@changesets/cli` to v3.
- eeb856f: Build with tsdown instead of two `tsc` passes.
  
  The published entry points, formats and file layout are unchanged, but the emitted
  JavaScript differs and the per-module `.d.ts` files are now rolled up into a single
  `esm/index.d.ts`. Declaration maps (`.d.ts.map`) are no longer emitted; the TypeScript
  sources still ship in `ts/`.

## 2.0.0

### Major Changes

- 392cf7c: Update to latest specification

## 1.0.0

### Major Changes

- b137fa2: Initial release.
  Extract from `resolve.imports`.
