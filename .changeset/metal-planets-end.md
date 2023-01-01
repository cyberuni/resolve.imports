---
'resolve.imports': patch
---

Return `undefined` if the import is recursive.

The spec does not support recursion: https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification
