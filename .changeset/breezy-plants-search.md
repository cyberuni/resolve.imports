---
'resolve.imports': patch
---

Fix array pattern handling.

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
