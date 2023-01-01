import { describe, expect, it } from '@jest/globals'
import { patternKeyCompare } from './resolve.js'

/**
 * @see https://nodejs.org/api/esm.html#esm_resolver_algorithm_specification
 */
describe(`PATTERN_KEY_COMPARE`, () => {
  it.skip('Assert: keyA ends with "/" or contains only a single "*".', () => { })
  it.skip('Assert: keyB ends with "/" or contains only a single "*".', () => { })
  it('If baseLengthA is greater than baseLengthB, return -1.', () => {
    expect(patternKeyCompare('abc', 'ab')).toBe(-1)
    expect(patternKeyCompare('abcd', 'ab*')).toBe(-1)
    expect(patternKeyCompare('abc*', 'abc')).toBe(-1)
    expect(patternKeyCompare('abc*', 'ab*')).toBe(-1)
  })
  it('If baseLengthB is greater than baseLengthA, return 1.', () => {
    expect(patternKeyCompare('ab', 'abc')).toBe(1)
    expect(patternKeyCompare('ab*', 'abcd')).toBe(1)
    expect(patternKeyCompare('abc', 'abc*')).toBe(1)
    expect(patternKeyCompare('ab*', 'abc*')).toBe(1)
  })
  it('If keyA does not contain "*", return 1.', () => {
    expect(patternKeyCompare('abc', 'ab*')).toBe(1)
  })
  it('If keyB does not contain "*", return -1.', () => {
    expect(patternKeyCompare('ab*', 'abc')).toBe(-1)
  })
  it('If the length of keyA is greater than the length of keyB, return -1.', () => {
    expect(patternKeyCompare('abc*', 'ab*')).toBe(-1)
  })
  it('If the length of keyB is greater than the length of keyA, return 1.', () =>{
    expect(patternKeyCompare('ab*', 'abc*')).toBe(1)
  })
  it('Return 0.', () => {
    expect(patternKeyCompare('abd*', 'abc*')).toBe(0)
  })
})
