---
'resolve.imports': patch
---

Filter out non expensionKeys.
This does not affect the behavior of the package.
Just that it match closer to the spec.

Even if the non expensionKeys are not filtered,
the behavior is the same.
It's actually not sure if doing a filter first is faster or not.
