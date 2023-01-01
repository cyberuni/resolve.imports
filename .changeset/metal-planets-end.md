---
'resolve.imports': patch
---

Do not support recursive resolution.

The spec does not support recursion: https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification

`resolve()` will return `undefined` if the import is recursive.
