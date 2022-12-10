import { describe, expect, it } from '@jest/globals'
import { resolve } from './index.js'

it('works with chalk v5', () => {
  const pkg = {
    imports: {
      '#ansi-styles': './source/vendor/ansi-styles/index.js',
      '#supports-color': {
        node: './source/vendor/supports-color/index.js',
        default: './source/vendor/supports-color/browser.js'
      }
    }
  }
  const options = { conditions: ['import', 'node', 'node-addons'] }
  expect(resolve(pkg, '#ansi-styles', options)).toBe(
    './source/vendor/ansi-styles/index.js'
  )
  expect(resolve(pkg, '#supports-color', options)).toBe(
    './source/vendor/supports-color/index.js'
  )
})
