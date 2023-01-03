import { describe, expect, it } from '@jest/globals'
import { resolve } from './index.js'
import { manifest } from './testutils/index.js'

describe('subpath imports', () => {
  it('throws when no imports field', () => {
    expect(() => resolve(manifest({}), '#ansi-styles')).toThrow('Package import specifier "#ansi-styles" is not defined in package path/to/package/package.json imported from working/dir')
  })

  it('throws when no match', () => {
    expect(() => resolve(manifest({ imports: {} }), '#ansi-styles')).toThrow('Package import specifier "#ansi-styles" is not defined in package path/to/package/package.json imported from working/dir')
  })

  it('throws when import key does not start with #', () => {
    expect(() => resolve(manifest({ imports: { 'x': 'y' } }), '#x'))
      .toThrow("Package import specifier \"#x\" is not defined in package path/to/package/package.json imported from working/dir")
  })

  it('throws if specifier is exactly # or #/', () => {
    const pkg = manifest({ imports: { '#': 'y', '#/': 'x' } })
    expect(() => resolve(pkg, '#')).toThrow('')
  })

  it('throws when specifier does not start with #', () => {
    expect(() => resolve(
      manifest({
        imports: {
          '#ansi-styles': './browser.js'
        }
      }),
      'something-else'
    )).toThrow('import specifier must start with #')
  })

  it('returns the value if it is string', () => {
    const r = resolve(
      manifest({
        imports: {
          '#ansi-styles': './browser.js'
        }
      }),
      '#ansi-styles'
    )
    expect(r).toBe('./browser.js')
  })

  it('returns the value if it is string[]', () => {
    // the actual resolution (check which file exists and thus accept),
    // is up to the engine, we just return the array.
    const r = resolve(
      manifest({
        imports: {
          '#ansi-styles': ['./a.js', './b.js']
        }
      }),
      '#ansi-styles'
    )
    expect(r).toEqual(['./a.js', './b.js'])
  })

  it('returns first matched condition', () => {
    const r = resolve(
      manifest({
        imports: {
          '#supports-color': {
            node: './node.js',
            default: './browser.js'
          }
        }
      }),
      '#supports-color',
      { conditions: ['node', 'default'] }
    )
    expect(r).toBe('./node.js')
  })

  it('accepts options without conditions', () => {
    const r = resolve(
      manifest({
        imports: {
          '#supports-color': {
            node: './node.js',
            default: './browser.js'
          }
        }
      }),
      '#supports-color',
      {}
    )
    expect(r).toBe('./browser.js')
  })

  it('works with nested conditions', () => {
    const r = resolve(
      manifest({
        imports: {
          '#supports-color': {
            node: {
              import: './node.mjs',
              require: './node.cjs'
            },
            default: './browser.mjs'
          }
        }
      }),
      '#supports-color',
      { conditions: ['node', 'import'] }
    )
    expect(r).toBe('./node.mjs')
  })

  it('works with explicit file path', () => {
    const pkg = manifest({
      imports: {
        '#internal/a.js': './src/internal/a.js',
        '#internal/b.js': {
          import: './src/internal/b.mjs',
          require: './src/internal/b.cjs',
          default: './src/browser/b.mjs'
        },
        '#internal/c.js': {
          node: {
            import: './src/internal/c.mjs',
            require: './src/internal/c.cjs',
          },
          default: './src/browser/c.mjs'
        }
      }
    })
    expect(resolve(pkg, '#internal/a.js')).toBe('./src/internal/a.js')
    expect(resolve(pkg, '#internal/b.js')).toBe('./src/browser/b.mjs')
    expect(resolve(pkg, '#internal/b.js', { conditions: ['import'] })).toBe('./src/internal/b.mjs')
    expect(resolve(pkg, '#internal/c.js')).toBe('./src/browser/c.mjs')
    expect(resolve(pkg, '#internal/c.js', { conditions: ['node', 'require'] })).toBe('./src/internal/c.cjs')
  })
})

describe(`subpath patterns`, () => {
  it('match trail *', () => {
    const r = resolve(
      manifest({
        imports: {
          '#internal/*': './src/internal/*'
        }
      }),
      '#internal/foo.js'
    )
    expect(r).toBe('./src/internal/foo.js')
  })

  it('maps to string pattern', () => {
    const r = resolve(
      manifest({
        imports: {
          '#internal/*.js': './src/internal/*.js'
        }
      }),
      '#internal/foo.js'
    )
    expect(r).toBe('./src/internal/foo.js')
  })

  it('maps to string[] pattern', () => {
    const r = resolve(
      manifest({
        imports: {
          '#internal/*.js': ['./src/internal/*.js', './src/internal2/*.js']
        }
      }),
      '#internal/foo.js'
    )
    expect(r).toEqual(['./src/internal/foo.js', './src/internal2/foo.js'])
  })

  it('maps based on condition', () => {
    const r = resolve(
      manifest({
        imports: {
          '#internal/*.js': {
            node: './node/*.js',
            default: './browser/*.js'
          }
        }
      }),
      '#internal/foo.js',
      { conditions: ['node', 'default'] }
    )
    expect(r).toBe('./node/foo.js')
  })

  it('maps with nested conditions', () => {
    const r = resolve(
      manifest({
        imports: {
          '#internal/*.js': {
            node: {
              import: './node/*.mjs',
              require: './node/*.cjs'
            },
            default: './browser/*.mjs'
          }
        }
      }),
      '#internal/foo.js',
      { conditions: ['node', 'import'] }
    )
    expect(r).toBe('./node/foo.mjs')
  })

  it('works with deeply nested conditions', () => {
    const r = resolve(manifest({
      imports: {
        '#a': {
          a: {
            b: {
              c: {
                d: './a.js'
              }
            }
          }
        }
      }
    }), '#a', { conditions: ['a', 'b', 'c', 'd'] })
    expect(r).toBe('./a.js')
  })

  it('goes to the next map if first match failed condition checks', () => {
    const r = resolve(
      manifest({
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
      }),
      '#internal/foo/bar.js',
      { conditions: ['node', 'import'] }
    )
    expect(r).toBe('./foo/node/bar.mjs')
  })

  it('repeat match value for each *', () => {
    const r = resolve(
      manifest({
        imports: {
          '#internal/*.js': './src/internal/*/*.js'
        }
      }),
      '#internal/foo.js'
    )
    expect(r).toBe('./src/internal/foo/foo.js')
  })
})

// Do not see any spec for this.
// So do not support it for now to avoid deviating from spec.
it('does not support recursive references', () => {
  const pkg = manifest({
    imports: {
      '#internal/*.js': '#internal/*.js',
      '#a': '#b',
      '#b': './b.js',
    }
  })
  expect(resolve(pkg, '#a')).toBeUndefined()
  expect(resolve(pkg, '#internal/foo.js')).toBeUndefined()
})
