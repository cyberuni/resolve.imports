import { expect, it } from '@jest/globals'
import { resolve } from './index.js'

it('returns undefined when no imports field', () => {
  const r = resolve({}, '#ansi-styles')
  expect(r).toBeUndefined()
})

it('returns first matched condition', () => {
  const r = resolve({
    imports: {
      '#ansi-styles': {
        node: './node.js',
        default: './browser.js',
      },
    },
  }, '#ansi-styles', { conditions: ['node', 'default'] })
  expect(r).toBe('./node.js')
})
