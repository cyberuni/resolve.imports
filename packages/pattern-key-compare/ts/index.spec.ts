import { describe, expect, it } from '@jest/globals'
import { patternKeyCompare } from './index.js'

/**
 * @see https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification
 */
describe(`PATTERN_KEY_COMPARE`, () => {
  it('Assert: keyA contains only a single "*".', () => {
    expect(() => patternKeyCompare('ab', 'b*')).toThrow(`'ab' does not contain '*'`)
    expect(() => patternKeyCompare('a**', 'b*')).toThrow(`'a**' has more than one '*'`)
  })
  it('Assert: keyB contains only a single "*".', () => {
    expect(() => patternKeyCompare('a*', 'b')).toThrow(`'b' does not contain '*'`)
    expect(() => patternKeyCompare('a*', 'b*c*')).toThrow(`'b*c*' has more than one '*'`)
  })
  it('Assert: keyB contains only a single "*".', () => { })
  it('If baseLengthA is greater than baseLengthB, return -1.', () => {
    expect(patternKeyCompare('abc*', 'bc*')).toBe(-1)
  })
  it('If baseLengthB is greater than baseLengthA, return 1.', () => {
    expect(patternKeyCompare('ab*', 'abc*')).toBe(1)
  })
  it('If the length of keyA is greater than the length of keyB, return -1.', () => {
    expect(patternKeyCompare('ab*c', 'ab*')).toBe(-1)
  })
  it('If the length of keyB is greater than the length of keyA, return 1.', () =>{
    expect(patternKeyCompare('ab*', 'ab*d')).toBe(1)
  })
  it('Return 0.', () => {
    expect(patternKeyCompare('abc*', 'bcd*')).toBe(0)
  })
})
