---
'resolve.imports': patch
---

Do not support recursive resolution.

There is no spec for it.
It will return `undefined` if the import is recursive.
