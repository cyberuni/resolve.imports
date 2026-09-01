---
'pattern-key-compare': patch
'resolve.imports': patch
---

Build with tsdown instead of two `tsc` passes.

The published entry points, formats and file layout are unchanged, but the emitted
JavaScript differs and the per-module `.d.ts` files are now rolled up into a single
`esm/index.d.ts`. Declaration maps (`.d.ts.map`) are no longer emitted; the TypeScript
sources still ship in `ts/`.
