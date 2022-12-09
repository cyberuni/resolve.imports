import { describe, expect, it } from '@jest/globals'
import { resolve } from './index.js'

describe('no * pattern', () => {
  it('returns undefined when no imports field', () => {
    const r = resolve({}, '#ansi-styles')
    expect(r).toBeUndefined()
  })

  it('returns undefined when entry does not start with #', () => {
    const r = resolve(
      {
        imports: {
          '#ansi-styles': './browser.js'
        }
      },
      'something-else'
    )
    expect(r).toBeUndefined()
  })

  it('returns the value if it is string', () => {
    const r = resolve(
      {
        imports: {
          '#ansi-styles': './browser.js'
        }
      },
      '#ansi-styles'
    )
    expect(r).toBe('./browser.js')
  })

  it('returns the value if it is string[]', () => {
    // the actual resolution (check which file exists and thus accept),
    // is up to the engine, we just return the array.
    const r = resolve(
      {
        imports: {
          '#ansi-styles': ['./a.js', './b.js']
        }
      },
      '#ansi-styles'
    )
    expect(r).toEqual(['./a.js', './b.js'])
  })

  it('returns first matched condition', () => {
    const r = resolve(
      {
        imports: {
          '#supports-color': {
            node: './node.js',
            default: './browser.js'
          }
        }
      },
      '#supports-color',
      { conditions: ['node', 'default'] }
    )
    expect(r).toBe('./node.js')
  })

  it('accepts options without conditions', () => {
    const r = resolve(
      {
        imports: {
          '#supports-color': {
            node: './node.js',
            default: './browser.js'
          }
        }
      },
      '#supports-color',
      {}
    )
    expect(r).toBe('./browser.js')
  })

  it('works with nested conditions', () => {
    const r = resolve(
      {
        imports: {
          '#supports-color': {
            node: {
              import: './node.mjs',
              require: './node.cjs'
            },
            default: './browser.mjs'
          }
        }
      },
      '#supports-color',
      { conditions: ['node', 'import'] }
    )
    expect(r).toBe('./node.mjs')
  })
})

describe(`subpath patterns`, () => {
  it('maps to string pattern', () => {
    const r = resolve(
      {
        imports: {
          '#internal/*.js': './src/internal/*.js'
        }
      },
      '#internal/foo.js'
    )
    expect(r).toBe('./src/internal/foo.js')
  })

  it('maps to string[] pattern', () => {
    const r = resolve(
      {
        imports: {
          '#internal/*.js': ['./src/internal/*.js', './src/internal2/*.js']
        }
      },
      '#internal/foo.js'
    )
    expect(r).toEqual(['./src/internal/foo.js', './src/internal2/foo.js'])
  })

  it('maps based on condition', () => {
    const r = resolve(
      {
        imports: {
          '#internal/*.js': {
            node: './node/*.js',
            default: './browser/*.js'
          }
        }
      },
      '#internal/foo.js',
      { conditions: ['node', 'default'] }
    )
    expect(r).toBe('./node/foo.js')
  })

  it('maps with nested conditions', () => {
    const r = resolve(
      {
        imports: {
          '#internal/*.js': {
            node: {
              import: './node/*.mjs',
              require: './node/*.cjs'
            },
            default: './browser/*.mjs'
          }
        }
      },
      '#internal/foo.js',
      { conditions: ['node', 'import'] }
    )
    expect(r).toBe('./node/foo.mjs')
  })

  it('goes to the next map if first match failed condition checks', () => {
    const r = resolve(
      {
        imports: {
          '#internal/*.js': {
            node: {
              require: './node/*.cjs'
            },
            default: './browser/*.mjs'
          },
          '#internal/foo/*.js': {
            node: {
              import: './foo/node/*.mjs'
            },
            default: './foo/browser/*.mjs'
          }
        }
      },
      '#internal/foo/bar.js',
      { conditions: ['node', 'import'] }
    )
    expect(r).toBe('./foo/node/bar.mjs')
  })
})
