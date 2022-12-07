import { expect, it } from '@jest/globals'
import { resolve } from './index.js'

it('returns undefined when no imports field', () => {
  const r = resolve({}, '#ansi-styles')
  expect(r).toBeUndefined()
})

it('returns value if it is string', () => {
  const r = resolve({
    imports: {
      '#ansi-styles': './browser.js',
    },
  }, '#ansi-styles')
  expect(r).toBe('./browser.js')
})

it('returns first matched condition', () => {
  const r = resolve({
    imports: {
      '#supports-color': {
        node: './node.js',
        default: './browser.js',
      },
    },
  }, '#supports-color', { conditions: ['node', 'default'] })
  expect(r).toBe('./node.js')
})
